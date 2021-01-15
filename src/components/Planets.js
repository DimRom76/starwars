import { useQuery } from "react-query";
import { useState } from "react";
import Planet from "./Planet";

const fetchPlanets = async ({ queryKey }) => {
  const [_key, page] = queryKey;
  const res = await fetch(`http://swapi.dev/api/planets/?page=${page}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  const { isLoading, error, data, isPreviousData } = useQuery(
    ["planets", page],
    fetchPlanets,
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h2>Planets</h2>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 1}
      >
        Previous Page
      </button>{" "}
      <span>Current Page: {page}</span>
      <button
        onClick={() => {
          if (!isPreviousData && data.next) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPreviousData || !data.next}
      >
        Next Page
      </button>
      <div>
        {data.results.map((planet) => (
          <Planet key={planet.name} planet={planet} />
        ))}
      </div>
    </div>
  );
};

export default Planets;
