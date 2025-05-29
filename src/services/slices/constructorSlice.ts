import { TIngredient, TConstructorIngredient } from '@utils-types';
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

interface IConstructorState {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
}

export const initialState: IConstructorState = {
  ingredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    moveIngredientUp: (state, action) => {
      [
        state.ingredients[action.payload],
        state.ingredients[action.payload - 1]
      ] = [
        state.ingredients[action.payload - 1],
        state.ingredients[action.payload]
      ];
    },
    moveIngredientDown: (state, action) => {
      [
        state.ingredients[action.payload],
        state.ingredients[action.payload + 1]
      ] = [
        state.ingredients[action.payload + 1],
        state.ingredients[action.payload]
      ];
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearIngredients: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state
  }
});

export const {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearIngredients
} = constructorSlice.actions;
export const { selectBurgerConstructor } = constructorSlice.selectors;

export const burgerConstructorReducer = constructorSlice.reducer;
