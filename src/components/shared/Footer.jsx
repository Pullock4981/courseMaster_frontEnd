import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-base-200 to-base-300 border-t-2 border-primary/20 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
                {/* Brand */}
                <div className="space-y-3">
                    <Logo />
                    <p className="text-sm text-base-content/80 leading-relaxed">
                        Digital learning for the next generation. Transform your career with expert-led courses.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-bold mb-4 text-lg gradient-text">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a className="link link-hover text-base-content/80 hover:text-primary transition-colors" href="/">
                                Home
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover text-base-content/80 hover:text-primary transition-colors" href="/courses">
                                Courses
                            </a>
                        </li>
                        <li>
                            <a className="link link-hover text-base-content/80 hover:text-primary transition-colors" href="/about">
                                About Us
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold mb-4 text-lg gradient-text">Contact</h4>
                    <ul className="space-y-2 text-sm text-base-content/80">
                        <li className="flex items-center gap-2">
                            <span className="font-semibold">Email:</span>
                            <a href="mailto:support@coursemaster.com" className="link link-hover text-primary">
                                support@coursemaster.com
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="font-semibold">Phone:</span>
                            <span>+880 1XXXXXXXXX</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-sm py-4 bg-base-300/50 text-base-content/70 border-t border-base-300">
                © {new Date().getFullYear()} CourseMaster. All rights reserved.
            </div>
        </footer>
    );
}
