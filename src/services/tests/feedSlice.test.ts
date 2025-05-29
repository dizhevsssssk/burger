import {
  feedReducer,
  getFeeds,
  initialState
} from '../slices/feedSlice';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedSlice reducer tests', () => {
  it('устанавливает isLoading в true при загрузке', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает ошибку при отклонённой загрузке', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('загружает данные успешно', () => {
    const payload = {
      orders: [{ _id: '1', number: 1, status: 'done' }],
      total: 123,
      totalToday: 10
    };
    const action = {
      type: getFeeds.fulfilled.type,
      payload
    };
    const state = feedReducer(initialState, action);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(123);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
  });
});
