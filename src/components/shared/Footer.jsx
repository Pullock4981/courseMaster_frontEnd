import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-base-200 border-t border-base-300 mt-10">
            <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
                {/* Brand */}
                <div className="space-y-2">
                    <Logo />
                    <p className="text-sm text-base-content/70">
                        Digital learning for the next generation.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-semibold mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a className="link link-hover" href="/">Home</a></li>
                        <li><a className="link link-hover" href="/courses">Courses</a></li>
                        <li><a className="link link-hover" href="/about">About</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <p className="text-sm text-base-content/70">
                        Email: support@coursemaster.com
                    </p>
                    <p className="text-sm text-base-content/70">
                        Phone: +880 1XXXXXXXXX
                    </p>
                </div>
            </div>

            <div className="text-center text-xs py-3 bg-base-300 text-base-content/70">
                © {new Date().getFullYear()} CourseMaster. All rights reserved.
            </div>
        </footer>
    );
}
