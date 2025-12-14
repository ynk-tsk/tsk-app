import React from "react";
import Hero from "./Hero";
import SocialProof from "./SocialProof";
import Search from "./Search";
import Testimonials from "./Testimonials";
import Rankings from "./Rankings";
import ForPlayers from "./ForPlayers";
import ForCoaches from "./ForCoaches";
import ForClubs from "./ForClubs";
import ForOrganizers from "./ForOrganizers";
import Accompagnement from "./Accompagnement";
import Roadmap from "./Roadmap";

const HomePage = ({ T, initialFilter, clearInitialFilter, lang }) => (
  <>
    <Hero T={T} />
    <SocialProof T={T} />
    <Search T={T} initialFilter={initialFilter} clearInitialFilter={clearInitialFilter} lang={lang} />
    <Testimonials T={T} />
    <Rankings T={T} />
    <ForPlayers T={T} />
    <ForCoaches T={T} />
    <ForClubs T={T} />
    <ForOrganizers T={T} />
    <Accompagnement T={T} />
    <Roadmap T={T} />
  </>
);

export default HomePage;
