import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../store/slices/coursesSlice";
import { completeLessonAsync, fetchMyEnrollments } from "../../store/slices/enrollmentSlice";
import { getMyEnrollments, submitAssignment } from "../../services/enrollment.api";

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">{currentCourse.title}</h2>
                        <div className="flex justify-between items-center">
                            <p className="text-sm">Progress</p>
                            <p className="text-sm font-bold text-primary">
                                {enrollment?.progress?.percent || 0}%
                            </p>
                        </div>
                        <progress
                            className="progress progress-primary"
                            value={enrollment?.progress?.percent || 0}
                            max="100"
                        ></progress>
                    </div>
                </div>

                {lesson?.videoUrl && (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h3 className="card-title">{lesson.title}</h3>
                            <div className="aspect-video bg-base-300 rounded flex items-center justify-center">
                                <iframe
                                    className="w-full h-full rounded"
                                    src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                    title={lesson.title}
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <button
                                onClick={handleMarkComplete}
                                disabled={!!enrollment?.progress?.completedLessons?.includes(lesson?._id)}
                                className={`btn ${enrollment?.progress?.completedLessons?.includes(lesson?._id) ? "btn-disabled" : "btn-success"} mt-4`}
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
                    />
                )}

                {lesson?.quiz && lesson.quiz.length > 0 && (
                    <QuizInterface quiz={lesson.quiz} />
                )}
            </div>

            <div className="card bg-base-100 shadow h-fit sticky top-20">
                <div className="card-body">
                    <h3 className="card-title text-lg">Modules & Lessons</h3>

                    <div className="space-y-3 max-h-[70vh] overflow-y-auto">
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
                                        {mod.lessons?.map((les, lesIdx) => (
                                            <button
                                                key={lesIdx}
                                                onClick={() => setSelectedLesson(lesIdx)}
                                                className={`w-full text-left text-sm p-2 rounded transition ${selectedLesson === lesIdx
                                                    ? "bg-secondary text-secondary-content"
                                                    : "hover:bg-base-200"
                                                    }`}
                                            >
                                                {enrollment?.progress?.completedLessons?.includes(
                                                    les._id
                                                ) && "✓ "}
                                                {les.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignmentSubmission({ courseId, lessonId, prompt }) {
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            setSubmitted(true);
            setTimeout(() => setAnswer(""), 2000);
        } catch (err) {
            console.error("Failed to submit:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h3 className="card-title">Assignment</h3>
                <p className="text-sm">{prompt}</p>

                {submitted ? (
                    <div className="alert alert-success mt-4">
                        <span>✓ Assignment submitted successfully!</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter your answer or paste Google Drive link"
                            className="textarea textarea-bordered w-full"
                            rows="5"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || !answer.trim()}
                            className="btn btn-primary w-full"
                        >
                            {loading ? "Submitting..." : "Submit Assignment"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function QuizInterface({ quiz }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswer = (questionIdx, optionIdx) => {
        if (!submitted) {
            setAnswers({ ...answers, [questionIdx]: optionIdx });
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        quiz.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) {
                correctCount++;
            }
        });

        const percentage = Math.round((correctCount / quiz.length) * 100);
        setScore(percentage);
        setSubmitted(true);
    };

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h3 className="card-title">Quiz</h3>

                <div className="space-y-6 mt-4">
                    {quiz.map((question, qIdx) => (
                        <div key={qIdx} className="border border-base-300 p-4 rounded">
                            <p className="font-semibold mb-3">
                                {qIdx + 1}. {question.question}
                            </p>
                            <div className="space-y-2">
                                {question.options?.map((option, oIdx) => (
                                    <label key={oIdx} className="cursor-pointer flex gap-3">
                                        <input
                                            type="radio"
                                            name={`question-${qIdx}`}
                                            checked={answers[qIdx] === oIdx}
                                            onChange={() => handleAnswer(qIdx, oIdx)}
                                            disabled={submitted}
                                            className="radio radio-sm"
                                        />
                                        <span className="text-sm">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== quiz.length}
                        className="btn btn-primary mt-6 w-full"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <div className="alert alert-info mt-6">
                        <div>
                            <h4 className="font-bold">Quiz Results</h4>
                            <p className="text-lg mt-2">
                                You scored: <span className="font-bold text-primary">{score}%</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
