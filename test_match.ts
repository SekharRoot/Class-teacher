import { isStudentInClass } from './src/utils/classUtils';

const student = { id: '1', classId: 'PCB4' } as any;
const cls = { id: 'c1', classStandard: 'PCB', section: '4', board: 'CBSE' } as any;
console.log(isStudentInClass(student, cls)); // should be true

const student2 = { id: '1', classId: 'PCB 4' } as any;
console.log(isStudentInClass(student2, cls)); // should be true

const student3 = { id: '1', classId: 'XII D2' } as any;
const cls3 = { id: 'c1', classStandard: 'XII D2', section: 'A', board: 'CBSE' } as any;
console.log(isStudentInClass(student3, cls3)); // should be true
