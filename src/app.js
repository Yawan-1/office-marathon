import { AssetProvider } from "./providers/asset";
// import {  } from "./providers/navigation";
import NavigationProvider from "./providers/navigation";
import { ThemeProvider } from "./providers/theme";

export function App() {
  return (
    <AssetProvider>
      <ThemeProvider>
        <NavigationProvider />
      </ThemeProvider>
    </AssetProvider>
  );
}

// export default App;
