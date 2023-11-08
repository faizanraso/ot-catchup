function isValid(stale: string, latest: string, otjson: any) {
  let modifiedStale: string = stale;
  let currIndex: number = 0;
  let otjsonArray: any[] = JSON.parse(otjson);

  for (let i = 0; i < otjsonArray.length; i++) {
    switch (otjsonArray[i].op) {
      case "skip":
        currIndex += otjsonArray[i].count;
        if (currIndex > modifiedStale.length) return false;
        break;
      case "delete":
        if (currIndex + otjsonArray[i].count > modifiedStale.length)
          return false;
        modifiedStale =
          modifiedStale.slice(0, currIndex) +
          modifiedStale.slice(currIndex + otjsonArray[i].count);
        break;
      case "insert":
        modifiedStale =
          modifiedStale.slice(0, currIndex) +
          otjsonArray[i].chars +
          modifiedStale.slice(currIndex, modifiedStale.length);
        currIndex += otjsonArray[i].chars.length;
        break;
      default:
        break;
    }
  }
  if (modifiedStale === latest) return true;
  return false;
}

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "Repl.it uses operational transformations.",
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
  )
);
// true

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "Repl.it uses operational transformations.",
    '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
  )
);
// false, delete past end

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "Repl.it uses operational transformations.",
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
  )
);
// false, skip past end

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "We use operational transformations to keep everyone in a multiplayer repl in sync.",
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
  )
);
// true

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "We can use operational transformations to keep everyone in a multiplayer repl in sync.",
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
  )
);
// false

console.log(
  isValid(
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.",
    "[]"
  )
);
// true
