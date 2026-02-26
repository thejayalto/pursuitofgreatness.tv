import { supabase } from "./supabase"

export interface Movie {
  id: number
  show_title: string
  show_director: string
  show_description: string
  show_poster_url: string
}

export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("show_list")
    .select("id, show_title, show_director, show_description, show_poster_url")
    .order("id")

  if (error) {
    console.error("Error fetching movies:", error.message)
    return []
  }

  return data ?? []
}

export async function getRandomMovie(): Promise<Movie | null> {
  const movies = await getMovies()
  if (movies.length === 0) return null
  return movies[Math.floor(Math.random() * movies.length)]
}
