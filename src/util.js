export function tagsMatch(a, b) {
  return a.type === b.type && a.name === b.name
}

export function findMatchingTag(list, tag) {
  return list.find((t) => tagsMatch(t, tag))
}

export function getPrimaryTags(song) {
  return {
    title: song.tags["Title"][0]?.name,
    artist: song.tags["Artist"][0]?.name,
    album: song.tags["Album"][0]?.name,
  }
}

export function partitionTags(song, includedTypes) {
  const included = []
  const excluded = []
  for (const type in song.tags) {
    const addTo = includedTypes.includes(type) ? included : excluded
    for (const tag of song.tags[type]) {
      addTo.push(tag)
    }
  }
  return [included, excluded]
}

export function getPlaylistName(playlist, filters) {
  if (playlist?.name) {
    return [playlist.name, false]
  } else if (filters.length === 0) {
    return ["All Songs", true]
  } else if (filters.length === 1 && filters[0].length === 1) {
    const transform = tagTransforms[filters[0][0].type]
    return [transform ? transform(filters[0][0].name) : filters[0][0].name, true]
  } else {
    return ["Untitled Playlist", true]
  }
}

export function depthClone(object, depth = 0) {
  if (depth === 0) {
    return object
  } else if (Array.isArray(object)) {
    return object.map((x) => depthClone(x, depth - 1))
  } else if (typeof object === "object") {
    const result = {}
    for (const key in object) {
      result[key] = depthClone(object[key], depth - 1)
    }
    return result
  } else {
    return object
  }
}

export const tagTransforms = {
  Track: (name) => String(parseInt(name)),
  Duration: (name) => {
    const duration = parseInt(name)
    return `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`
  },
}
