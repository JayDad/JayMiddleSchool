import { MDXRemote } from "next-mdx-remote/rsc";
import HeatingCurve from "./viz/HeatingCurve";
import DensityTank from "./viz/DensityTank";
import SolubilityCurve from "./viz/SolubilityCurve";
import PureMixtureViz from "./viz/PureMixtureViz";
import DistillationApparatus from "./viz/DistillationApparatus";
import DistillationCurve from "./viz/DistillationCurve";
import RecrystallizationViz from "./viz/RecrystallizationViz";
import FiltrationFunnel from "./viz/FiltrationFunnel";
import ChromatographyViz from "./viz/ChromatographyViz";
import MassVolumeGraph from "./viz/MassVolumeGraph";
import PureMixtureCurve from "./viz/PureMixtureCurve";
import ParticleMotion from "./viz/ParticleMotion";
import HeatTransferModes from "./viz/HeatTransferModes";
import SpecificHeatRace from "./viz/SpecificHeatRace";
import BimetalStrip from "./viz/BimetalStrip";
import StaticElectricityViz from "./viz/StaticElectricityViz";
import CircuitDiagram from "./viz/CircuitDiagram";
import OhmsLawGraph from "./viz/OhmsLawGraph";
import MagneticFieldViz from "./viz/MagneticFieldViz";
import ElectromagneticInduction from "./viz/ElectromagneticInduction";
import EarthMoonOrbit from "./viz/EarthMoonOrbit";
import LunarPhases from "./viz/LunarPhases";
import PlanetComparison from "./viz/PlanetComparison";
import SunLayers from "./viz/SunLayers";
import PhotosynthesisDiagram from "./viz/PhotosynthesisDiagram";
import PlantRespirationCycle from "./viz/PlantRespirationCycle";
import TranspirationViz from "./viz/TranspirationViz";
import DigestionTract from "./viz/DigestionTract";
import CirculationLoop from "./viz/CirculationLoop";
import RespirationLungs from "./viz/RespirationLungs";
import ExcretionKidney from "./viz/ExcretionKidney";

const components = {
  HeatingCurve,
  DensityTank,
  SolubilityCurve,
  PureMixtureViz,
  DistillationApparatus,
  DistillationCurve,
  RecrystallizationViz,
  FiltrationFunnel,
  ChromatographyViz,
  MassVolumeGraph,
  PureMixtureCurve,
  ParticleMotion,
  HeatTransferModes,
  SpecificHeatRace,
  BimetalStrip,
  StaticElectricityViz,
  CircuitDiagram,
  OhmsLawGraph,
  MagneticFieldViz,
  ElectromagneticInduction,
  EarthMoonOrbit,
  LunarPhases,
  PlanetComparison,
  SunLayers,
  PhotosynthesisDiagram,
  PlantRespirationCycle,
  TranspirationViz,
  DigestionTract,
  CirculationLoop,
  RespirationLungs,
  ExcretionKidney,
};

export default function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-content">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
