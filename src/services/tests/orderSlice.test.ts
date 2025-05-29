import {
  initialState,
  orderReducer,
  getOrders,
  getOrderData,
  createOrder,
  clearOrderData
} from '../slices/orderSlice';

describe('orderSlice reducers and async thunks', () => {
  test('should handle createOrder.pending action', () => {
    const action = { type: createOrder.pending.type };
    const newState = orderReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.orderRequest).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('should handle createOrder.fulfilled and update state with order', () => {
    const sampleOrder = {
      ingredients: ['abc', 'def'],
      _id: 'abc123',
      status: 'done',
      name: 'Test Burger',
      createdAt: '2025-05-29T10:00:00Z',
      updatedAt: '2025-05-29T10:01:00Z',
      number: 555,
      price: 1500
    };
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: sampleOrder }
    };
    const newState = orderReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orderRequest).toBe(false);
    expect(newState.orderData).toEqual(sampleOrder);
    expect(newState.orders).toContainEqual(sampleOrder);
  });

  test('should handle createOrder.rejected with error message', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Failed to create order' }
    };
    const newState = orderReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orderRequest).toBe(false);
    expect(newState.error).toBe('Failed to create order');
  });

  test('getOrders.fulfilled updates orders array and sets loading false', () => {
    const ordersPayload = [{ _id: '1' }, { _id: '2' }];
    const action = {
      type: getOrders.fulfilled.type,
      payload: ordersPayload
    };
    const newState = orderReducer(initialState, action);

    expect(newState.orders).toEqual(ordersPayload);
    expect(newState.isLoading).toBe(false);
  });

  test('getOrderData.fulfilled sets the current orderData correctly', () => {
    const order = { _id: 'xyz789', number: 777 };
    const action = {
      type: getOrderData.fulfilled.type,
      payload: { orders: [order] }
    };
    const newState = orderReducer(initialState, action);

    expect(newState.orderData).toEqual(order);
    expect(newState.isLoading).toBe(false);
  });

  test('clearOrderData reducer resets orderData to null', () => {
    const stateWithOrder = { ...initialState, orderData: { _id: 'temp' } };
    const newState = orderReducer(stateWithOrder, clearOrderData());

    expect(newState.orderData).toBeNull();
  });
});
