import { useInfiniteQuery } from "react-query";
import React, { useState } from "react";

import Person from "./Person";

const fetchPeople = async ({ pageParam = null }) => {
  //логика получения новой страницы разная для каждого API
  let url = pageParam;
  if (pageParam === null) {
    url = `http://swapi.dev/api/people/?page=1`;
  }
  console.log("pageLoad :>> ", url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

const People = () => {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery("people", fetchPeople, {
    getNextPageParam: (lastPage) => {
      //логика получения новой страницы разная для каждого API
      return lastPage.next;
    },
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h2>People</h2>
      <div>
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.results.map((person) => (
              <Person key={person.name} person={person} />
            ))}
          </React.Fragment>
        ))}

        {/* {data.pages.results.map((person) => (
          <Person key={person.name} person={person} />
        ))} */}
      </div>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
};

export default People;
