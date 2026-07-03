import path from "path";
import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerFonts(): void {
  if (registered) return;
  Font.register({
    family: "Sarabun",
    fonts: [
      { src: path.join(process.cwd(), "public/fonts/Sarabun-Regular.ttf") },
      {
        src: path.join(process.cwd(), "public/fonts/Sarabun-Bold.ttf"),
        fontWeight: "bold",
      },
    ],
  });
  registered = true;
}
