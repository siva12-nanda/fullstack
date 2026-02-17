import { useEffect, useState } from 'react'
import countryService from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll()
      .then(data => setCountries(data))
  }, [])

  const handleChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const filtered = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Find Countries</h2>

      <input value={search} onChange={handleChange} />

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : filtered.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filtered.length > 1 ? (
        filtered.map(country => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => showCountry(country)}>
              show
            </button>
          </div>
        ))
      ) : filtered.length === 1 ? (
        <CountryDetails country={filtered[0]} />
      ) : (
        <p>No matches</p>
      )}
    </div>
  )
}

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>

      <p><strong>Capital:</strong> {country.capital?.[0]}</p>
      <p><strong>Area:</strong> {country.area}</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="150" />
    </div>
  )
}

export default App
