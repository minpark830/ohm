import {problemDiagramAssets} from './problem-diagram-assets.js';
const diagrams=new Map(problemDiagramAssets.map(diagram=>[diagram.id,diagram]));
// Owner edits increment the version. Hide the original diagram rather than show stale values.
export function diagramForProblem(problem){const diagram=diagrams.get(problem.id);return problem.version===1&&diagram?.title===problem.title?diagram:null;}
