import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
const Main = () => {
	return (
		<main>
			<section class="hero text-center">
				<div class="container-sm">
					<div class="hero-inner">
						<h1 class="hero-title h2-mobile mt-0 is-revealing">
							Academix
						</h1>
						<p class="hero-paragraph is-revealing">
							Powered with AI, Academix provides an innovative, mobile-responsive
							platform for students, educators, and professionals.
							With easy-to-use features and seamless access across
							devices, it empowers users to create, share, and
							explore educational resources effortlessly.{" "}
						</p>
						<div class="hero-form newsletter-form field field-grouped is-revealing">
							<div class="control control-expanded">
								<Link
									to="/login"
									className="button button-primary button-block button-shadow"
								>
									Start Learning
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="features section text-center">
				<div class="container">
					<div class="features-inner section-inner has-bottom-divider">
						<div class="features-wrap">
							<div class="feature is-revealing">
								<div class="feature-inner">
									<div class="feature-icon">
										<svg
											width="80"
											height="80"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g fill="none" fill-rule="evenodd">
												<path
													d="M48.066 61.627c6.628 0 10.087-16.79 10.087-23.418 0-6.627-5.025-9.209-11.652-9.209C39.874 29 24 42.507 24 49.135c0 6.627 17.439 12.492 24.066 12.492z"
													fill-opacity=".24"
													fill="#A0A6EE"
												/>
												<path
													d="M26 54l28-28"
													stroke="#838DEA"
													stroke-width="2"
													stroke-linecap="square"
												/>
												<path
													d="M26 46l20-20M26 38l12-12M26 30l4-4M34 54l20-20M42 54l12-12"
													stroke="#767DE1"
													stroke-width="2"
													stroke-linecap="square"
												/>
												<path
													d="M50 54l4-4"
													stroke="#838DEA"
													stroke-width="2"
													stroke-linecap="square"
												/>
											</g>
										</svg>
									</div>
									<h3 class="feature-title">Discover</h3>
									<p class="text-sm">
										Explore a diverse range of courses and
										resources tailored for different fields
										and interests. Academix makes finding
										and enrolling in educational materials
										easy and accessible.
									</p>
								</div>
							</div>
							<div class="feature is-revealing">
								<div class="feature-inner">
									<div class="feature-icon">
										<svg
											width="80"
											height="80"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g fill="none" fill-rule="evenodd">
												<path
													d="M48.066 61.627c6.628 0 10.087-16.79 10.087-23.418 0-6.627-5.025-9.209-11.652-9.209C39.874 29 24 42.507 24 49.135c0 6.627 17.439 12.492 24.066 12.492z"
													fill-opacity=".24"
													fill="#75ABF3"
												/>
												<path
													d="M34 52V35M40 52V42M46 52V35M52 52V42M28 52V28"
													stroke="#4D8EF7"
													stroke-width="2"
													stroke-linecap="square"
												/>
											</g>
										</svg>
									</div>
									<h3 class="feature-title">Collaborate</h3>
									<p class="text-sm">
										Connect with fellow learners and
										educators to share insights, solve
										problems, and grow together. Academix
										fosters a collaborative learning
										environment for everyone.
									</p>
								</div>
							</div>
						</div>
						<div class="features-wrap">
							<div class="feature is-revealing">
								<div class="feature-inner">
									<div class="feature-icon">
										<svg
											width="80"
											height="80"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g fill="none" fill-rule="evenodd">
												<path
													d="M48.066 61.627c6.628 0 10.087-16.79 10.087-23.418 0-6.627-5.025-9.209-11.652-9.209C39.874 29 24 42.507 24 49.135c0 6.627 17.439 12.492 24.066 12.492z"
													fill-opacity=".32"
													fill="#FF97AC"
												/>
												<path
													stroke="#FF6D8B"
													stroke-width="2"
													stroke-linecap="square"
													d="M49 45h6V25H35v6M43 55h2v-2M25 53v2h2M27 35h-2v2"
												/>
												<path
													stroke="#FF6D8B"
													stroke-width="2"
													stroke-linecap="square"
													d="M43 35h2v2M39 55h-2M33 55h-2M39 35h-2M33 35h-2M45 49v-2M25 49v-2M25 43v-2M45 43v-2"
												/>
											</g>
										</svg>
									</div>
									<h3 class="feature-title">Create</h3>
									<p class="text-sm">
										Easily create, update, and share your
										own content. From notes to entire course
										modules, Academix offers tools for
										students and instructors to contribute
										meaningfully to the platform.
									</p>{" "}
								</div>
							</div>
							<div class="feature is-revealing">
								<div class="feature-inner">
									<div class="feature-icon">
										<svg
											width="80"
											height="80"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g
												transform="translate(24 25)"
												fill="none"
												fill-rule="evenodd"
											>
												<path
													d="M24.066 36.627c6.628 0 10.087-16.79 10.087-23.418C34.153 6.582 29.128 4 22.501 4 15.874 4 0 17.507 0 24.135c0 6.627 17.439 12.492 24.066 12.492z"
													fill-opacity=".32"
													fill="#A0EEE5"
												/>
												<circle
													stroke="#39D8C8"
													stroke-width="2"
													stroke-linecap="square"
													cx="5"
													cy="4"
													r="4"
												/>
												<path
													stroke="#39D8C8"
													stroke-width="2"
													stroke-linecap="square"
													d="M23 22h8v8h-8zM11 10l9 9"
												/>
											</g>
										</svg>
									</div>
									<h3 class="feature-title">
										Access Anywhere
									</h3>
									<p class="text-sm">
										Academix is fully responsive and
										optimized for any device, ensuring you
										have access to your resources anytime,
										anywhere, without compromising
										functionality or design.
									</p>{" "}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="newsletter section">
				<div class="container-sm">
					<div class="newsletter-inner section-inner">
						<div class="newsletter-header text-center is-revealing">
							<h2 class="section-title mt-0">
								Stay Updated with Academix
							</h2>
							<p class="section-paragraph">
								Join our community and be the first to receive
								updates on new courses, resources, and learning
								tools designed to enhance your academic journey.
								Get insider tips, expert insights, and exclusive
								access to content that empowers you to succeed.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Main;
