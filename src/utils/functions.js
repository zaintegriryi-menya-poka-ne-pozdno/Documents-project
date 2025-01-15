
export function deepEqual(obj1, obj2) {
  // Проверяем, является ли obj1 объектом, если нет, заменяем на пустой объект
  if (typeof obj1 !== 'object' || obj1 === null) {
    obj1 = {};
  }

  // Проверяем, является ли obj2 объектом, если нет, заменяем на пустой объект
  if (typeof obj2 !== 'object' || obj2 === null) {
    obj2 = {};
  }

  return Object.keys({ ...obj1, ...obj2 }).every(key => obj1[key] === obj2[key]);
}

export function deeperEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // Объекты идентичны (ссылка на один и тот же объект)

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false; // Один из аргументов не объект или равен null
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Разное количество ключей

  for (let key of keys1) {
    if (!keys2.includes(key)) return false; // Ключ отсутствует во втором объекте
    if (!deepEqual(obj1[key], obj2[key])) return false; // Значения ключей не равны
  }

  return true; // Все ключи и значения равны
}

/*
export function deepEqual(obj1, obj2) {
  // console.log(obj1, obj2);
  return Object.keys({ ...obj1, ...obj2 }).every(key => obj1[key] === obj2[key]);
}


export function deeperEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // Объекты идентичны (ссылка на один и тот же объект)

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false; // Один из аргументов не объект или равен null
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Разное количество ключей

  for (let key of keys1) {
    if (!keys2.includes(key)) return false; // Ключ отсутствует во втором объекте
    if (!deepEqual(obj1[key], obj2[key])) return false; // Значения ключей не равны
  }

  return true; // Все ключи и значения равны
}
*/