import {problemDiagramAssets} from './problem-diagram-assets.js?v=5601ad9fd5efe681';
import {expandedProblemDiagramAssets} from './expanded-problem-diagrams.js?v=5601ad9fd5efe681';
import {v4ProblemDiagrams} from './expansion-v4-diagrams.js?v=5601ad9fd5efe681';
import {v5ProblemDiagrams} from './expansion-v5-diagrams.js?v=5601ad9fd5efe681';
import {v6ProblemDiagrams} from './expansion-v6-diagrams.js?v=5601ad9fd5efe681';
import {v7ProblemDiagrams} from './expansion-v7-diagrams.js?v=5601ad9fd5efe681';
const originalSlugs=['one-loop-two-resistors','balance-the-node','loaded-voltage-divider','floating-source-supernode','rc-time-constant','charging-after-one-tau','discharge-to-quarter-voltage','loaded-rc-transient','bjt-current-gain','bjt-switch-current-limit','emitter-resistor-bias','bjt-transconductance','identify-nmos-region','nmos-saturation-current','nmos-triode-current','nmos-source-self-bias','boolean-absorption','full-adder-output','signed-addition-overflow','setup-time-budget','write-a-two-input-xor','write-a-two-to-one-mux','nonblocking-pipeline-step','repair-combinational-sensitivity'];
// Expansion IDs depend on the database's insertion history; match immutable slugs.
const diagrams=new Map([...problemDiagramAssets.map(diagram=>[originalSlugs[diagram.id-1],diagram]),...expandedProblemDiagramAssets.map(diagram=>[diagram.slug,diagram]),...v4ProblemDiagrams.map(diagram=>[diagram.slug,diagram]),...v5ProblemDiagrams.map(diagram=>[diagram.slug,diagram]),...v6ProblemDiagrams.map(diagram=>[diagram.slug,diagram]),...v7ProblemDiagrams.map(diagram=>[diagram.slug,diagram])]);
// Owner edits increment the version. Hide the original diagram rather than show stale values.
export function diagramForProblem(problem){const diagram=diagrams.get(problem?.slug);return problem?.version===1&&diagram?.title===problem.title?diagram:null;}
