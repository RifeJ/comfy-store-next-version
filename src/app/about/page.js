import { FaShieldHalved, FaTruckFast } from "react-icons/fa6";
import { GiFruitTree } from "react-icons/gi";

const team = [
  {
    name: "Azimjonov Abbosbek",
    role: "Founder & CEO",
    image: "/pizdech.jpg",
  },
  {
    name: "Alimkhanov Amirkhan",
    role: "Lead Interior Designer",
    image: "/ebatgey.jpg",
  },
  {
    name: "Shegay Maksim",
    role: "Head of Development",
    image: "/maksimniga.jpg",
  },
];

export default function AboutContent() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col gap-20">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          We love{" "}
          <span className="bg-primary text-primary-content px-4 py-1 rounded-xl">
            comfy
          </span>
        </h1>
        <p className="text-base-content/70 leading-relaxed text-lg">
          At ComfyStore, we believe that your home should be your personal
          sanctuary. Founded with a passion for minimal aesthetics and premium
          craftsmanship, we design thoughtful furniture spaces that blend
          timeless Nordic design with unparalleled, everyday comfort. Every
          piece tells a story of durability, sustainability, and style made just
          for your lifestyle.
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card border border-base-300 p-6 rounded-2xl text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-accent/10 text-primary rounded-xl text-3xl">
            <FaShieldHalved />
          </div>
          <h3 className="font-bold text-xl">Premium Quality</h3>
          <p className="text-sm text-base-content/60">
            We use only the finest sustainable materials to craft furniture that
            stands the test of time.
          </p>
        </div>
        <div className="bg-card border border-base-300 p-6 rounded-2xl text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-accent/10 text-primary rounded-xl text-3xl">
            <FaTruckFast />
          </div>
          <h3 className="font-bold text-xl">Fast Delivery</h3>
          <p className="text-sm text-base-content/60">
            Free shipping and professional assembly at your doorstep within 48
            hours.
          </p>
        </div>
        <div className="bg-card border border-base-300 p-6 rounded-2xl text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-accent/10 text-primary rounded-xl text-3xl">
            <GiFruitTree />
          </div>
          <h3 className="font-bold text-xl">Eco Production</h3>
          <p className="text-sm text-base-content/60">
            We care about nature. For every single chair or sofa crafted, we
            plant a new tree.
          </p>
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          The Minds Behind Comfy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-card border border-base-300 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="font-bold text-lg text-base-content">
                  {member.name}
                </h4>
                <p className="text-sm text-primary font-medium mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
