export default function HeroSection() {
  return (
    <section id="heroSection" className="hero--section">
      <div className="hero--section--content--box">
        <div className="hero--section--content">
          <p className="section--title">Hey, I'm </p>
          <h1 className="hero--section--title">
            <span className="hero--section-title--color">Your</span>{" "}
            <br />
            EDUCATOR
          </h1>
          <p className="hero--section-description">            
            Educators narrate tales of inspiration, shaping minds, fostering curiosity, and empowering lifelong learners to soar.
            <br />
          </p>
        </div>
        <button className="btn btn-primary">Watch My Courses</button>
      </div>
      <div className="hero--section--img">
        <img src="./img/hero_img.png" alt="Hero Section" />
      </div>
    </section>
  );
}
