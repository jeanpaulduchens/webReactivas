/** Laboratorio 1: Aplicaciones Web Reactivas (CC5003).
 *
 * Integrantes:
 * - Francisco González Urriola.
 * - Sergio Romero Véliz.
 * - Jorge Cummins Holger.
 */

/**
 * =============================
 *  PREGUNTA 1
 * =============================
 */

/**
a) Significa que revisa los tipos del programa antes de ejecutarlo. Las ventajas sobre el tipado dinámico
son que permite detectar antes errores que ocurrirían en runtime.

b) El tipo any admite cualquier tipo sin quejarse, en cambio el tipo unknown permite cualquier tipo pero no
permite realizar operaciones.
En el ejemplo dado .toUpperCase() para el caso de data: any funciona y no habrán quejas del LSP/transpilador,
en cambio en el caso de data: unknown habrá un warning
 
c) Significa que si dos tipos tienen los mismos atributos entonces son el mismo tipo

*/

interface A {
  foo: string;
}

interface B {
  foo: string;
}

const bar = (a: A) => a;
const x: B = { foo: "1" };
const y = bar(x); // no se queja porque A y B son equilvalentes~!

/**
 * =============================
 *  PREGUNTA 2
 * =============================
 */

const data = require("../bakemons.json") as Bakemon[];

enum BakemonType {
  Normal,
  Fire,
  Water,
  Electric,
  Grass,
  Ice,
  Fighting,
  Poison,
  Ground,
  Flying,
  Psychic,
  Bug,
  Rock,
  Ghost,
  Dragon,
  Dark,
  Steel,
  Fairy,
}

/**
 * Interfaz Bakemon
 *
 * Interfaz para los tipos de un "bakemon". Esta cuenta con tipos primarios, secundarios (con restricciones dadas en
 * enunciado) ademas de las estadisticas de cada "bakemon".
 *
 */
interface Bakemon {
  id: number;
  name: string;
  type: BakemonType;
  secondary_type?: BakemonType;
  stats: {
    hp: number;
    atk: number;
    def: number;
    sp_atk: number;
    sp_def: number;
    speed: number;
  };
  moves: {
    name: string;
    type: BakemonType;
    power: number;
  }[];
}

/**
 * =============================
 *  PREGUNTA 3
 * =============================
 */

/** Funcion filterByType
 *
 * Funcion que filtra una coleccion de "bakemons" segun su tipo primario o secundario. La funcion hace uso de
 * filter para crear un nuevo array con los "bakemons" que cumplen con la condicion.
 *
 * @param bakemons: Coleccion de "bakemons" a filtrar.
 * @param type: Tipo de "bakemon" a filtrar.
 *
 */
function filterByType(bakemons: Bakemon[], type: BakemonType): Bakemon[] {
  // Filtra los bakemons por su tipo primario o secundario.
  return bakemons.filter(
    (bakemon) => bakemon.type == type || bakemon.secondary_type == type,
  );
}

/**
 * =============================
 *  PREGUNTA 4
 * =============================
 */

/** Interfaz BakemonBST
 *
 * Interfaz que extiende de Bakemon que incluye el atributo "bst", el cual corresponde a las suma de las estadisticas de
 * un "bakemon".
 *
 */
interface BakemonBST extends Bakemon {
  bst: number;
}

/** Funcion addBST
 *
 * Funcion que mapea una coleccion de "bakmemons" calculando el "bst" de cada uno y agregandole devolviendo un arreglo
 * de "BakemonBST", el cual es similar al original pero con el atributo "bst" agregado.
 *
 * @param bakemons
 * @see BakemonBST para mas detalles sobre el tipo de retorno.
 */
function addBST(bakemons: Bakemon[]): BakemonBST[] {
  return bakemons.map((bakemon) => {
    const stats = bakemon.stats;
    const bst =
      stats.hp +
      stats.atk +
      stats.def +
      stats.sp_atk +
      stats.sp_def +
      stats.speed;
    return { ...bakemon, bst } as BakemonBST;
  });
}

/** Razon de la eleccion del tipo:
 * Se uso un tipo "BakemonBST" de la interfaz respectiva para poder utilizar los mismos atributos del tipo original
 * pero agregando uno nuevo que corresponderia al "BST" solicitado. Esto se prefirio por sobre la opcion de usar "type"
 * pues esta no permite agregar nuevos atributos (o propiedades) a otro ya existente.
 */

/**
 * =============================
 *  PREGUNTA 5
 * =============================
 */

// Guarda tipos de bakemon con un bakemon y su bst
type BakemonByType = {
  [key in BakemonType]?: BakemonBST;
};

function findStrongestByType(bakemons: Bakemon[]): BakemonByType {
  const bakemonsBST = addBST(bakemons);
  const result: BakemonByType = {};

  bakemonsBST.forEach((b) => {
    if (b.bst > (result[b.type]?.bst ?? 0)) {
      result[b.type] = b;
    }

    if (b.secondary_type) {
      if (b.bst > (result[b.secondary_type]?.bst ?? 0))
        result[b.secondary_type] = b;
    }
  });

  return result;
}
