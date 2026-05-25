import { MDXRemote } from "next-mdx-remote/rsc";
import HeatingCurve from "./viz/HeatingCurve";
import DensityTank from "./viz/DensityTank";
import SolubilityCurve from "./viz/SolubilityCurve";

const components = {
  HeatingCurve,
  DensityTank,
  SolubilityCurve,
};

export default function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-content">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
