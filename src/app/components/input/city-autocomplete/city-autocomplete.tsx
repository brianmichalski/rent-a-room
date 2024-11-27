import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { useState } from "react"
import { CityResult } from "../../../../types/results"

interface CityAutocompleteProps {
  cities: CityResult[]
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ cities }) => {
  const [selectedCity, setSelectedCity] = useState({})
  const [query, setQuery] = useState('')

  const filteredCities =
    query === ''
      ? cities
      : cities.filter((city) => {
        return city.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <Combobox value={selectedCity} onChange={setSelectedCity}>
      <ComboboxInput onChange={(event) => setQuery(event.target.value)} />
      <ComboboxOptions>
        {filteredCities.map((city) => (
          <ComboboxOption key={city.id} value={city.name}>
            {`${city.name}, ${city.province}`}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

export default CityAutocomplete;