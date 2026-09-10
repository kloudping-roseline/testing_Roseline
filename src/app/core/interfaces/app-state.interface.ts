import { CartState } from "../../features/cart/store/cart.reducer";
import { HomeState } from "../../features/home/interfaces/home.interface";
import { ShopState } from "../../features/shop/interfaces/shop.interfaces";
import { SearchState } from "../../features/searchbar/interfaces/search.interface";
import { AuthState } from "../../features/auth/interfaces/auth.interface";

export interface AppState {
  cart: CartState;
  home: HomeState;
  shop: ShopState;
  search: SearchState;
  auth: AuthState;
}
