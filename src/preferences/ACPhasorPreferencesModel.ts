import ACPhasorNamespace from "../ACPhasorNamespace.js";

/**
 * Reserved for simulation-specific preferences (Preferences → Simulation). Each preference
 * Property should take its initial value from a query parameter in
 * acPhasorQueryParameters.ts; add the matching control to ACPhasorPreferencesNode and register the
 * node under `simulationOptions.customPreferences` in src/main.ts.
 */
export class ACPhasorPreferencesModel {
  public reset(): void {
    // No simulation-specific preferences yet.
  }
}

ACPhasorNamespace.register("ACPhasorPreferencesModel", ACPhasorPreferencesModel);
