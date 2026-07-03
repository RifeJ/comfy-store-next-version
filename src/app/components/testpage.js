"use client";
import { useEffect } from "react";
import { storeFavorite } from "../services/storeCart";

export default function TestPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.favStore = storeFavorite.getState();

      storeFavorite.subscribe((state) =>
        console.log("❤️ Стор избранного обновился:", state),
      );
    }
  }, []);

  return <div className="p-8">Страница для теста сторов в консоли (F12)</div>;
}
