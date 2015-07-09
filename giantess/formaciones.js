//tipo uno caida recta
//tipo dos x ini fijo,x final random (linea recta a destino
//tipo tres zigzag
//tipo cuatro rebota en laterales
//X1,x2,x3,x4 ene tipo 1,2,3
//O1,O1,o3 cala tipo 1,2,3
//x1||x2 tipo 1 o 2
// - espacio
// . linea

var formaciones= new Array();
//bloques de 45 segundos
var cont=0;
formaciones[0]=new Array()
formaciones[0][cont++]="x1;x1;x1;x1"
formaciones[0][cont++]="x1|x2|o1;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3"
formaciones[0][cont++]="x2;x1;x1;x2"
formaciones[0][cont++]="x1;x1;x1;x1"
formaciones[0][cont++]="x2;x1;x2;x1;x2"

var cont=0;
formaciones[1]=new Array()
formaciones[1][cont++]="x1;x1;x1;x1.x1;x1;x1;x1"
formaciones[1][cont++]="x2;x1;x1;x2.x1;x2;x2;x1"
formaciones[1][cont++]="x1;x2;x1;x2.x2;x1;x2;x1"
formaciones[1][cont++]="x1;x1;x1;x1.x2;x2;x2;x2"
formaciones[1][cont++]="x2;x2;x2.x2;x2;x2"


var cont=0;
formaciones[2]=new Array()
formaciones[2][cont++]="x1|o1.x1|o1.x1|o1.x1|o1.x1|o1"
formaciones[2][cont++]="x2|o2.x2|o2.x2|o2.x2|o2.x2|o2"
formaciones[2][cont++]="x3;x2;x3;x2.x2;x3;x2;x3"
formaciones[2][cont++]="x1;x1;x1;x1.x2;x2;x2;x2.x1;x2;x1;x2.x2;x1;x2;x1"
formaciones[2][cont++]="x2;x2;x2.x2;x2;x2.x2;x2;x2.x2;x2;x2"

var cont=0;
formaciones[3]=new Array()
formaciones[3][cont++]="x1|o1.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1"
formaciones[3][cont++]="x2|o2.x2|o2.x2|o2.x2|o2.x2|o2.x1|o1.x1|o1.x1|o1.x1|o1.x1|o1"
formaciones[3][cont++]="x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3"
formaciones[3][cont++]="x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3"
formaciones[3][cont++]="x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3"
formaciones[3][cont++]="x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3.x1|x2|x3;x1|x2|x3;x1|x2|x3;x1|x2|x3"

var cont=0;
formaciones[4]=new Array()
formaciones[4][cont++]="x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1"
formaciones[4][cont++]="x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2"
formaciones[4][cont++]="x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3"
formaciones[4][cont++]="x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4"
formaciones[4][cont++]="x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1.x1|o1;x1|o1"
formaciones[4][cont++]="x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2.x2|o2;x2|o2"
formaciones[4][cont++]="x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3.x3|o3;x3|o3"
formaciones[4][cont++]="x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4.x4|o4;x4|o4"

var cont=0;
formaciones[5]=new Array()
formaciones[5][cont++]="x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*"
formaciones[5][cont++]="x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*"
formaciones[5][cont++]="x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*"
formaciones[5][cont++]="x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*"
formaciones[5][cont++]="x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*"
formaciones[5][cont++]="x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*"
formaciones[5][cont++]="x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*"
formaciones[5][cont++]="x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*"

var cont=0;
formaciones[6]=new Array()
formaciones[6][cont++]="x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*"
formaciones[6][cont++]="x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*"
formaciones[6][cont++]="x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*"
formaciones[6][cont++]="x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*"
formaciones[6][cont++]="x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*.x1|o*;x1|o*;x1|o*;x1|o*"
formaciones[6][cont++]="x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*.x2|o*;x2|o*;x2|o*;x2|o*"
formaciones[6][cont++]="x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*.x3|o*;x3|o*;x3|o*;x3|o*"
formaciones[6][cont++]="x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*.x4|o*;x4|o*;x4|o*;x4|o*"


var cont=0;
formaciones[7]=new Array()
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"
formaciones[7][cont++]="x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*.x1|x2|x3|x4|o*;x1|x2|x3|x4|o*;x1|x2|x3|x4|o*"



