"use client";

import { useMemo, useState } from "react";
import { Country, State } from "country-state-city";

type CountryStateSelectProps = {
  countryFieldName?: string;
  stateFieldName?: string;
  defaultCountryName?: string | null;
  defaultStateName?: string | null;
  required?: boolean;
  labelClassName?: string;
};

export function CountryStateSelect({
  countryFieldName = "country",
  stateFieldName = "state",
  defaultCountryName,
  defaultStateName,
  required = false,
  labelClassName,
}: CountryStateSelectProps) {
  const countries = useMemo(() => Country.getAllCountries(), []);

  const initialCountryIso = useMemo(() => {
    if (!defaultCountryName) return "";
    const trimmed = defaultCountryName.trim().toLowerCase();
    return (
      countries.find(
        (country) =>
          country.name.toLowerCase() === trimmed ||
          country.isoCode.toLowerCase() === trimmed,
      )?.isoCode ?? ""
    );
  }, [countries, defaultCountryName]);

  const [countryIso, setCountryIso] = useState<string>(initialCountryIso);

  const states = useMemo(
    () => (countryIso ? State.getStatesOfCountry(countryIso) : []),
    [countryIso],
  );

  const initialStateIso = useMemo(() => {
    if (!defaultStateName || !initialCountryIso) return "";
    const trimmed = defaultStateName.trim().toLowerCase();
    const initialStates = State.getStatesOfCountry(initialCountryIso);
    return (
      initialStates.find(
        (state) =>
          state.name.toLowerCase() === trimmed ||
          state.isoCode.toLowerCase() === trimmed,
      )?.isoCode ?? ""
    );
  }, [defaultStateName, initialCountryIso]);

  const [stateIso, setStateIso] = useState<string>(initialStateIso);

  const selectedCountryName =
    countries.find((country) => country.isoCode === countryIso)?.name ?? "";
  const selectedStateName =
    states.find((state) => state.isoCode === stateIso)?.name ?? "";

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <>
      <input type="hidden" name={countryFieldName} value={selectedCountryName} />
      <input type="hidden" name={stateFieldName} value={selectedStateName} />

      <div className="space-y-1">
        <label
          className={
            labelClassName ??
            "text-xs font-semibold uppercase tracking-wide text-indigo-700"
          }
        >
          Country {required ? <span className="text-rose-500">*</span> : null}
        </label>
        <select
          value={countryIso}
          onChange={(event) => {
            setCountryIso(event.target.value);
            setStateIso("");
          }}
          required={required}
          className={inputClass}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.flag ? `${country.flag} ` : ""}
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label
          className={
            labelClassName ??
            "text-xs font-semibold uppercase tracking-wide text-indigo-700"
          }
        >
          State / Province {required ? <span className="text-rose-500">*</span> : null}
        </label>
        <select
          value={stateIso}
          onChange={(event) => setStateIso(event.target.value)}
          required={required && states.length > 0}
          disabled={!countryIso}
          className={inputClass}
        >
          <option value="">
            {countryIso
              ? states.length === 0
                ? "No states available — leave blank"
                : "Select state"
              : "Select country first"}
          </option>
          {states.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
