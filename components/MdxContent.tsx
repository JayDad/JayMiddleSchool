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
};

export default function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-content">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
