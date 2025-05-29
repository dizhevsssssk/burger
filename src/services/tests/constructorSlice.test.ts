import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearIngredients,
  initialState
} from '../slices/constructorSlice';

describe('Редьюсер конструктора бургера', () => {
  const bun = {
    id: '1',
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0
  };

  const ingredient1 = {
    id: '2',
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  };

  const ingredient2 = {
    id: '3',
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
    __v: 0
  };

  it('должен добавить булку в state', () => {
    const nextState = burgerConstructorReducer(initialState, addIngredient(bun));
    expect(nextState.bun).toMatchObject({
      ...bun,
      id: expect.any(String)
    });
  });

  it('должен добавить обычный ингредиент в список', () => {
    const next = burgerConstructorReducer(initialState, addIngredient(ingredient1));
    expect(next.ingredients.length).toBe(1);
    expect(next.ingredients[0]).toMatchObject({
      ...ingredient1,
      id: expect.any(String)
    });
  });

  it('должен удалить ингредиент по id', () => {
    const added = burgerConstructorReducer(initialState, addIngredient(ingredient1));
    const toRemove = added.ingredients[0];
    const updated = burgerConstructorReducer(added, removeIngredient(toRemove));
    expect(updated.ingredients).toHaveLength(0);
  });

  it('должен переместить ингредиенты вверх и вниз', () => {
    const state1 = burgerConstructorReducer(initialState, addIngredient(ingredient1));
    const state2 = burgerConstructorReducer(state1, addIngredient(ingredient2));

    const movedUp = burgerConstructorReducer(state2, moveIngredientUp(1));
    expect(movedUp.ingredients[0].name).toBe(ingredient2.name);
    expect(movedUp.ingredients[1].name).toBe(ingredient1.name);

    const movedDown = burgerConstructorReducer(movedUp, moveIngredientDown(0));
    expect(movedDown.ingredients[0].name).toBe(ingredient1.name);
    expect(movedDown.ingredients[1].name).toBe(ingredient2.name);
  });

  it('должен очищать все ингредиенты и булку', () => {
    const filled = burgerConstructorReducer(initialState, addIngredient(ingredient1));
    const withBun = burgerConstructorReducer(filled, addIngredient(bun));
    const cleared = burgerConstructorReducer(withBun, clearIngredients());
    expect(cleared).toEqual(initialState);
  });
});
