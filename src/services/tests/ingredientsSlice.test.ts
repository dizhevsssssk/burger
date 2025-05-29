import {
  ingredientsReducer,
  getIngredients,
  initialState
} from '../slices/ingredientsSlice';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice reducer', () => {
  it('переводит состояние в режим загрузки', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает неудачный запрос', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Не удалось получить данные' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось получить данные');
  });

  it('обновляет ингредиенты после успешного запроса', () => {
    const mockData = [
      {
        id: '1',
        name: 'Тест булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 3,
        calories: 120,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: '',
        _id: 'someid1',
        __v: 0
      }
    ];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockData
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockData);
  });
});
