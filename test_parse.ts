import { parseClassName } from './src/utils/csvImport';
import { isStudentInClass } from './src/utils/classUtils';

console.log(parseClassName("XIID2"));
console.log(parseClassName("XII D2"));
console.log(parseClassName("XII-D2"));
console.log(parseClassName("XII/D2"));

const student = { id: '1', classId: 'XIID2' } as any;
const cls = { id: 'c1', classStandard: 'XIID2', section: 'A', board: 'CBSE' } as any;
console.log("isStudentInClass (XIID2, XIID2 A):", isStudentInClass(student, cls));
