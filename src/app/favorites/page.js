import React from "react";
import { storeFavorite } from "../services/storeCart";

export default function Favorites() {
  const favoriteItems = storeFavorite((state) => state.favoriteItems);
  return <div></div>;
}
