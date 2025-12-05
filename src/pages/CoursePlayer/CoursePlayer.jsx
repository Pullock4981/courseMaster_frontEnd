import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../store/slices/coursesSlice";
import { completeLessonAsync, fetchMyEnrollments } from "../../store/slices/enrollmentSlice";
import { getMyEnrollments, submitAssignment } from "../../services/enrollment.api";
import { submitQuiz as submitQuizAPI } from "../../services/quiz.api";

// Helper function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url) => {
    if (!url) return "";

    // If already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
        return url;
    }

    // Handle youtu.be short URLs
    if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // Handle regular YouTube URLs (watch?v=...)
    if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1]?.split("&")[0];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // Handle YouTube URLs with /v/ format
    if (url.includes("youtube.com/v/")) {
        const videoId = url.split("youtube.com/v/")[1]?.split("?")[0]?.split("&")[0];
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // If it's already an embed URL or doesn't match patterns, return as is
    return url;
};

export default function CoursePlayer() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [enrollment, setEnrollment] = useState(null);
    const [selectedModule, setSelectedModule] = useState(0);
    const [selectedLesson, setSelectedLesson] = useState(0);
    const [loading, setLoading] = useState(true);

    const { currentCourse } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCourseById(id)).then(() => setLoading(false));

        const fetchEnrollment = async () => {
            try {
                const res = await getMyEnrollments();
                const userEnroll = res.data.find((e) => e.course?._id === id);
                setEnrollment(userEnroll);
            } catch (err) {
                console.error("Failed to load enrollment:", err);
            }
        };
        fetchEnrollment();
    }, [id, dispatch]);

    const handleMarkComplete = async () => {
        if (!enrollment) return;

        const currentLesson =
            currentCourse?.syllabus[selectedModule]?.lessons[selectedLesson];
        if (!currentLesson) return;

        try {
            const result = await dispatch(
                completeLessonAsync({
                    enrollmentId: enrollment._id,
                    lessonId: currentLesson._id,
                })
            ).unwrap();

            if (result) setEnrollment(result);
            else {
                // fallback: re-fetch
                const res = await getMyEnrollments();
                const userEnroll = res.data.find((e) => e.course?._id === id);
                setEnrollment(userEnroll);
            }

            // refresh global enrollments for dashboard
            dispatch(fetchMyEnrollments());
        } catch (err) {
            console.error("Failed to mark lesson complete:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!currentCourse) {
        return <div className="alert alert-error">Course not found</div>;
    }

    const module = currentCourse.syllabus?.[selectedModule];
    const lesson = module?.lessons?.[selectedLesson];

    return (
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body p-3 sm:p-6">
                            <h2 className="card-title text-lg sm:text-xl md:text-2xl break-words">{currentCourse.title}</h2>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs sm:text-sm">Progress</p>
                                <p className="text-xs sm:text-sm font-bold text-primary">
                                    {enrollment?.progress?.percent || 0}%
                                </p>
                            </div>
                            <progress
                                className="progress progress-primary w-full mt-2"
                                value={enrollment?.progress?.percent || 0}
                                max="100"
                            ></progress>
                        </div>
                    </div>

                    {lesson?.videoUrl && (
                        <div className="card bg-base-100 shadow">
                            <div className="card-body p-3 sm:p-6">
                                <h3 className="card-title text-base sm:text-lg md:text-xl break-words">{lesson.title}</h3>
                                <div className="aspect-video bg-base-300 rounded overflow-hidden mt-2 sm:mt-4">
                                    <iframe
                                        className="w-full h-full"
                                        src={convertToEmbedUrl(lesson.videoUrl)}
                                        title={lesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        frameBorder="0"
                                    ></iframe>
                                </div>

                                <button
                                    onClick={handleMarkComplete}
                                    disabled={!!enrollment?.progress?.completedLessons?.includes(lesson?._id)}
                                    className={`btn btn-sm sm:btn-md ${enrollment?.progress?.completedLessons?.includes(lesson?._id) ? "btn-disabled" : "btn-success"} mt-3 sm:mt-4 w-full sm:w-auto`}
                                >
                                    {enrollment?.progress?.completedLessons?.includes(lesson?._id) ? "Completed ✓" : "✓ Mark as Complete"}
                                </button>
                            </div>
                        </div>
                    )}

                    {lesson?.assignmentPrompt && (
                        <AssignmentSubmission
                            courseId={id}
                            lessonId={lesson._id}
                            prompt={lesson.assignmentPrompt}
                            enrollment={enrollment}
                            onComplete={handleMarkComplete}
                        />
                    )}

                    {lesson?.quiz && lesson.quiz.length > 0 && (
                        <QuizInterface
                            quiz={lesson.quiz}
                            courseId={id}
                            lessonId={lesson._id}
                            enrollment={enrollment}
                            onComplete={handleMarkComplete}
                        />
                    )}
                </div>

                <div className="card bg-base-100 shadow h-fit lg:sticky lg:top-20 order-first lg:order-last">
                    <div className="card-body p-3 sm:p-6">
                        <h3 className="card-title text-base sm:text-lg mb-2 sm:mb-4">Modules & Lessons</h3>

                        <div className="space-y-2 sm:space-y-3 max-h-[40vh] sm:max-h-[50vh] lg:max-h-[70vh] overflow-y-auto">
                            {currentCourse.syllabus?.map((mod, modIdx) => (
                                <div key={modIdx} className="space-y-2">
                                    <button
                                        onClick={() => {
                                            setSelectedModule(modIdx);
                                            setSelectedLesson(0);
                                        }}
                                        className={`w-full text-left font-semibold p-2 rounded transition ${selectedModule === modIdx
                                            ? "bg-primary text-primary-content"
                                            : "bg-base-200 hover:bg-base-300"
                                            }`}
                                    >
                                        📚 {mod.title}
                                    </button>

                                    {selectedModule === modIdx && (
                                        <div className="space-y-1 pl-4">
                                            {mod.lessons?.map((les, lesIdx) => {
                                                const hasAssignment = !!les.assignmentPrompt;
                                                const hasQuiz = les.quiz && les.quiz.length > 0;
                                                const isCompleted = enrollment?.progress?.completedLessons?.includes(les._id);

                                                return (
                                                    <button
                                                        key={lesIdx}
                                                        onClick={() => setSelectedLesson(lesIdx)}
                                                        className={`w-full text-left text-sm p-2 rounded transition flex items-center justify-between gap-2 ${selectedLesson === lesIdx
                                                            ? "bg-secondary text-secondary-content"
                                                            : "hover:bg-base-200"
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-1 flex-1 min-w-0">
                                                            {isCompleted && <span className="text-success">✓</span>}
                                                            <span className="truncate">{les.title}</span>
                                                        </span>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            {hasAssignment && (
                                                                <span className="badge badge-xs badge-secondary" title="Has Assignment">📝</span>
                                                            )}
                                                            {hasQuiz && (
                                                                <span className="badge badge-xs badge-primary" title="Has Quiz">❓</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignmentSubmission({ courseId, lessonId, prompt, enrollment, onComplete }) {
    const dispatch = useDispatch();
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previousSubmission, setPreviousSubmission] = useState(null);
    const [loadingPrevious, setLoadingPrevious] = useState(true);

    // Check for previous submission on mount
    useEffect(() => {
        const checkPreviousSubmission = async () => {
            try {
                const { getMyAssignments } = await import("../../services/assignment.api");
                const response = await getMyAssignments(courseId);
                const submissions = response.data || [];
                const previous = submissions.find(
                    (sub) => String(sub.lessonId) === String(lessonId)
                );
                if (previous) {
                    setPreviousSubmission(previous);
                    setSubmitted(true);
                }
            } catch (err) {
                console.error("Failed to fetch previous submission:", err);
            } finally {
                setLoadingPrevious(false);
            }
        };
        checkPreviousSubmission();
    }, [courseId, lessonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await submitAssignment(courseId, lessonId, answer.trim());
            setSubmitted(true);

            // Fetch the updated submission
            try {
                const { getMyAssignments } = await import("../../services/assignment.api");
                const response = await getMyAssignments(courseId);
                const submissions = response.data || [];
                const updated = submissions.find(
                    (sub) => String(sub.lessonId) === String(lessonId)
                );
                if (updated) {
                    setPreviousSubmission(updated);
                }
            } catch (fetchErr) {
                console.error("Failed to fetch updated submission:", fetchErr);
            }

            // Mark lesson as complete after assignment submission
            if (enrollment && onComplete) {
                try {
                    await onComplete();
                    // Refresh enrollments for dashboard
                    dispatch(fetchMyEnrollments());
                } catch (err) {
                    console.error("Failed to mark lesson complete:", err);
                }
            }

            // Clear the answer field
            setAnswer("");
        } catch (err) {
            console.error("Failed to submit:", err);
            setError(err.response?.data?.message || "Failed to submit assignment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingPrevious) {
        return (
            <div className="card bg-base-100 shadow">
                <div className="card-body p-3 sm:p-6">
                    <h3 className="card-title text-base sm:text-lg">Assignment</h3>
                    <div className="flex justify-center py-4 sm:py-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "reviewed":
                return <span className="badge badge-success">Reviewed</span>;
            case "pending":
                return <span className="badge badge-warning">Pending Review</span>;
            default:
                return <span className="badge badge-ghost">{status || "Pending"}</span>;
        }
    };

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-3 sm:p-6">
                <h3 className="card-title text-base sm:text-lg">Assignment</h3>
                <p className="text-xs sm:text-sm mt-2">{prompt}</p>

                {error && (
                    <div className="alert alert-error mt-4">
                        <span>{error}</span>
                    </div>
                )}

                {/* Show previous submission if exists */}
                {previousSubmission && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-base-200 rounded-lg border border-base-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <h4 className="font-semibold text-sm sm:text-base">My Submission</h4>
                            <div className="flex-shrink-0">{getStatusBadge(previousSubmission.status)}</div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Your Answer:</label>
                                {previousSubmission.answerType === "link" ? (
                                    <div className="mt-1">
                                        <a
                                            href={previousSubmission.answer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link link-primary break-all text-xs sm:text-sm"
                                        >
                                            {previousSubmission.answer}
                                        </a>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-xs sm:text-sm whitespace-pre-wrap bg-base-300 p-2 sm:p-3 rounded">
                                        {previousSubmission.answer}
                                    </p>
                                )}
                            </div>

                            {previousSubmission.grade !== null && previousSubmission.grade !== undefined && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Grade:</label>
                                    <p className="text-xl sm:text-2xl font-bold text-primary mt-1">
                                        {previousSubmission.grade}%
                                    </p>
                                </div>
                            )}

                            {previousSubmission.reviewNotes && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Feedback:</label>
                                    <p className="mt-1 text-xs sm:text-sm bg-base-300 p-2 sm:p-3 rounded whitespace-pre-wrap">
                                        {previousSubmission.reviewNotes}
                                    </p>
                                </div>
                            )}

                            {previousSubmission.reviewer && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Reviewed by:</label>
                                    <p className="text-xs sm:text-sm font-medium mt-1">
                                        {previousSubmission.reviewer?.name || "Admin"}
                                    </p>
                                </div>
                            )}

                            <div className="text-xs text-gray-400 pt-2 border-t border-base-300">
                                Submitted: {new Date(previousSubmission.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Show form only if not submitted */}
                {!previousSubmission && (
                    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter your answer or paste Google Drive link"
                            className="textarea textarea-bordered w-full text-sm"
                            rows="4"
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !answer.trim()}
                            className="btn btn-primary btn-sm sm:btn-md w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span className="hidden sm:inline">Submitting...</span>
                                </>
                            ) : (
                                "Submit Assignment"
                            )}
                        </button>
                    </form>
                )}

                {submitted && !previousSubmission && (
                    <div className="alert alert-success mt-4">
                        <span>✓ Assignment submitted successfully!</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuizInterface({ quiz, courseId, lessonId, enrollment, onComplete }) {
    const dispatch = useDispatch();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previousSubmission, setPreviousSubmission] = useState(null);
    const [loadingPrevious, setLoadingPrevious] = useState(true);

    // Check for previous submission on mount
    useEffect(() => {
        const checkPreviousSubmission = async () => {
            try {
                const { getMyQuizSubmissions } = await import("../../services/quiz.api");
                const response = await getMyQuizSubmissions(courseId);
                const submissions = response.data || [];

                // Find submission for this specific lesson (get the most recent one)
                const lessonSubmissions = submissions.filter(
                    (sub) => String(sub.lessonId) === String(lessonId)
                );

                if (lessonSubmissions.length > 0) {
                    // Get the most recent submission
                    const previous = lessonSubmissions.sort((a, b) => {
                        const dateA = new Date(a.createdAt || a.submittedAt || 0);
                        const dateB = new Date(b.createdAt || b.submittedAt || 0);
                        return dateB - dateA;
                    })[0];

                    setPreviousSubmission(previous);
                    // Don't set submitted to true - allow retaking
                    // setSubmitted(true);
                    setScore(previous.percent || previous.score || 0);
                    // Restore previous answers if available
                    if (previous.answers && Array.isArray(previous.answers)) {
                        const answersObj = {};
                        previous.answers.forEach((answer, idx) => {
                            if (answer !== undefined && answer !== null && answer >= 0) {
                                answersObj[idx] = answer;
                            }
                        });
                        setAnswers(answersObj);
                    }
                }
            } catch (err) {
                console.error("Failed to check previous submission:", err);
            } finally {
                setLoadingPrevious(false);
            }
        };

        checkPreviousSubmission();
    }, [courseId, lessonId]);

    const handleAnswer = (questionIdx, optionIdx) => {
        // Always allow answering - if there's a previous submission, reset submitted state for retake
        if (submitted && previousSubmission) {
            setSubmitted(false);
        }
        setAnswers({ ...answers, [questionIdx]: optionIdx });
    };

    const handleSubmit = async () => {
        // Allow resubmission - students can retake quizzes
        // Just show a warning if they've already submitted
        if (submitted && previousSubmission) {
            const confirmRetake = window.confirm(
                "You have already submitted this quiz. Do you want to submit again? Your new score will replace the previous one."
            );
            if (!confirmRetake) {
                return;
            }
            // Reset submission state to allow new submission
            setSubmitted(false);
            setPreviousSubmission(null);
        }

        // Validate all questions are answered
        if (Object.keys(answers).length !== quiz.length) {
            setError("Please answer all questions before submitting.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Convert answers object to array format [selectedIndex, selectedIndex, ...]
            const answersArray = quiz.map((_, idx) => answers[idx] ?? -1);

            const response = await submitQuizAPI(courseId, lessonId, answersArray);
            const result = response.data;

            setScore(result.percent);
            setSubmitted(true);
            // Store the submission result to show marks immediately
            const submissionResult = {
                _id: result._id,
                score: result.score,
                total: result.total,
                percent: result.percent,
                lessonId: lessonId,
                answers: answersArray,
                createdAt: new Date(),
            };
            setPreviousSubmission(submissionResult);

            // Mark lesson as complete after quiz submission
            if (enrollment && onComplete) {
                try {
                    await onComplete();
                    // Refresh enrollments for dashboard
                    dispatch(fetchMyEnrollments());

                    // Show success message
                    console.log(`Quiz submitted successfully! Score: ${result.percent}% (${result.score}/${result.total})`);
                } catch (err) {
                    console.error("Failed to mark lesson complete:", err);
                }
            }
        } catch (err) {
            console.error("Failed to submit quiz:", err);
            const errorMsg = err.response?.data?.message || "Failed to submit quiz. Please try again.";
            setError(errorMsg);

            // If error suggests duplicate, check for previous submission
            if (errorMsg.includes("already") || errorMsg.includes("duplicate")) {
                const { getMyQuizSubmissions } = await import("../../services/quiz.api");
                try {
                    const response = await getMyQuizSubmissions(courseId);
                    const submissions = response.data || [];
                    const previous = submissions.find(
                        (sub) => String(sub.lessonId) === String(lessonId)
                    );
                    if (previous) {
                        setPreviousSubmission(previous);
                        setSubmitted(true);
                        setScore(previous.percent);
                    }
                } catch (checkErr) {
                    console.error("Failed to check previous submission:", checkErr);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingPrevious) {
        return (
            <div className="card bg-base-100 shadow">
                <div className="card-body p-3 sm:p-6">
                    <h3 className="card-title text-base sm:text-lg">Quiz</h3>
                    <div className="flex justify-center py-4 sm:py-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="card-title text-base sm:text-lg">Quiz</h3>
                    {previousSubmission && (
                        <span className="badge badge-success badge-sm sm:badge-md">Previously Submitted</span>
                    )}
                </div>

                {previousSubmission && !submitted && (
                    <div className="alert alert-info mt-3 sm:mt-4">
                        <div>
                            <h4 className="font-bold text-sm sm:text-base">Previous Quiz Results</h4>
                            <p className="text-base sm:text-lg mt-2">
                                You scored: <span className="font-bold text-primary">{previousSubmission.percent}%</span>
                            </p>
                            <p className="text-xs sm:text-sm mt-1 text-base-content/70">
                                {previousSubmission.score} out of {previousSubmission.total} questions correct
                            </p>
                            <p className="text-xs mt-1 text-base-content/60">
                                Submitted: {new Date(previousSubmission.createdAt || previousSubmission.submittedAt).toLocaleString()}
                            </p>
                            <p className="text-xs mt-2 text-base-content/60">
                                💡 You can change your answers below and click "Retake Quiz" to submit a new attempt
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                    {quiz.map((question, qIdx) => {
                        const userAnswer = answers[qIdx];
                        const isCorrect = userAnswer === question.correctIndex;
                        const showResults = submitted && previousSubmission;
                        const showReview = previousSubmission && !submitted;

                        return (
                            <div
                                key={qIdx}
                                className={`border p-3 sm:p-4 rounded ${showResults && isCorrect ? 'border-success bg-success/10' :
                                    showResults && !isCorrect ? 'border-error bg-error/10' :
                                        showReview && isCorrect ? 'border-success bg-success/10' :
                                            showReview && !isCorrect ? 'border-error bg-error/10' :
                                                'border-base-300'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 sm:mb-3">
                                    <p className="font-semibold flex-1 text-sm sm:text-base">
                                        {qIdx + 1}. {question.question}
                                    </p>
                                    {showResults && (
                                        <span className={`badge badge-sm sm:badge-md ${isCorrect ? 'badge-success' : 'badge-error'}`}>
                                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </span>
                                    )}
                                </div>

                                {showResults && (
                                    <div className="mb-2 sm:mb-3 p-2 rounded bg-base-200">
                                        {isCorrect ? (
                                            <p className="text-xs sm:text-sm text-success font-semibold">
                                                ✓ Correct! Your answer: {question.options[userAnswer]}
                                            </p>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-xs sm:text-sm text-error font-semibold">
                                                    ✗ Incorrect
                                                </p>
                                                <p className="text-xs text-base-content/70">
                                                    Your answer: <span className="text-error">{question.options[userAnswer]}</span>
                                                </p>
                                                <p className="text-xs text-base-content/70">
                                                    Correct answer: <span className="text-success font-semibold">{question.options[question.correctIndex]}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showReview && !loading && (
                                    <p className="text-xs mb-2 text-base-content/70">
                                        💡 Correct answer: <span className="font-semibold">{question.options[question.correctIndex]}</span>
                                    </p>
                                )}
                                <div className="space-y-2">
                                    {question.options?.map((option, oIdx) => (
                                        <label
                                            key={oIdx}
                                            className={`cursor-pointer flex gap-2 sm:gap-3 p-2 rounded transition ${showResults && oIdx === question.correctIndex ? 'bg-success/20' :
                                                showResults && oIdx === userAnswer && !isCorrect ? 'bg-error/20' :
                                                    showReview && oIdx === question.correctIndex ? 'bg-success/20' :
                                                        showReview && oIdx === userAnswer && !isCorrect ? 'bg-error/20' :
                                                            'hover:bg-base-200'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${qIdx}`}
                                                checked={answers[qIdx] === oIdx}
                                                onChange={() => {
                                                    if (!loading) {
                                                        handleAnswer(qIdx, oIdx);
                                                    }
                                                }}
                                                disabled={loading || showResults}
                                                className="radio radio-sm flex-shrink-0"
                                            />
                                            <span className="text-xs sm:text-sm flex-1">{option}</span>
                                            {showResults && oIdx === question.correctIndex && (
                                                <span className="text-success font-semibold">✓ Correct Answer</span>
                                            )}
                                            {showResults && oIdx === userAnswer && !isCorrect && (
                                                <span className="text-error font-semibold">✗ Your Answer</span>
                                            )}
                                            {showReview && !loading && oIdx === question.correctIndex && (
                                                <span className="text-success">✓ Correct</span>
                                            )}
                                            {showReview && !loading && oIdx === userAnswer && !isCorrect && (
                                                <span className="text-error">✗ Your Answer</span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <div className="alert alert-error mt-4">
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || Object.keys(answers).length !== quiz.length}
                    className="btn btn-primary btn-sm sm:btn-md mt-4 sm:mt-6 w-full"
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            <span className="hidden sm:inline">Submitting...</span>
                        </>
                    ) : previousSubmission ? (
                        "Retake Quiz"
                    ) : (
                        "Submit Quiz"
                    )}
                </button>

                {/* Show quiz results immediately after submission */}
                {submitted && previousSubmission && (
                    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                        <div className={`alert ${score >= 70 ? 'alert-success' : score >= 50 ? 'alert-warning' : 'alert-error'} shadow-lg`}>
                            <div className="w-full">
                                <h4 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">📊 Quiz Results</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                    <div className="text-center">
                                        <p className="text-3xl sm:text-4xl font-bold">{score}%</p>
                                        <p className="text-xs opacity-70">Score</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs sm:text-sm">Correct Answers</span>
                                            <span className="font-bold text-sm sm:text-base">{previousSubmission.score} / {previousSubmission.total}</span>
                                        </div>
                                        <progress
                                            className="progress progress-primary w-full"
                                            value={previousSubmission.score}
                                            max={previousSubmission.total}
                                        ></progress>
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm mt-2">
                                    {score >= 70 ? "🎉 Excellent work! You've mastered this lesson!" :
                                        score >= 50 ? "👍 Good effort! Keep practicing to improve!" :
                                            "📚 Keep studying! Review the material and try again."}
                                </p>
                                <p className="text-xs mt-2 opacity-70">
                                    ✅ Your quiz has been saved. View detailed marks in the Student Dashboard.
                                </p>
                            </div>
                        </div>

                        {/* Show correct/incorrect answers breakdown */}
                        <div className="card bg-base-200">
                            <div className="card-body p-3 sm:p-4">
                                <h5 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Answer Review</h5>
                                <div className="space-y-2">
                                    {quiz.map((question, qIdx) => {
                                        const userAnswer = answers[qIdx];
                                        const isCorrect = userAnswer === question.correctIndex;
                                        return (
                                            <div
                                                key={qIdx}
                                                className={`p-2 sm:p-3 rounded ${isCorrect ? 'bg-success/20' : 'bg-error/20'}`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className={`text-sm sm:text-base ${isCorrect ? 'text-success' : 'text-error'}`}>
                                                        {isCorrect ? '✓' : '✗'}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold">
                                                            Question {qIdx + 1}: {question.question}
                                                        </p>
                                                        <p className="text-xs mt-1">
                                                            Your answer: <span className={isCorrect ? 'text-success font-semibold' : 'text-error'}>
                                                                {question.options[userAnswer]}
                                                            </span>
                                                        </p>
                                                        {!isCorrect && (
                                                            <p className="text-xs mt-1 text-success">
                                                                Correct answer: <span className="font-semibold">{question.options[question.correctIndex]}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
