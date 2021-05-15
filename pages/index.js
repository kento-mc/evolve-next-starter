import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Index = () => {
  const [error, setError] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [evolvePosts, setEvolvePosts] = useState([]);

  const API_SERVER_URL = 'http://localhost:8000';
  const endpoint = 'evolve-posts';

  useEffect(() => {
    let mounted = true;

    const fetchDataAsync = async () => {
      try {
        const posts = await getPosts(API_SERVER_URL, endpoint);

        if (mounted) {
          setIsLoaded(true);
          setEvolvePosts(posts);
        }
      } catch (err) {
        setError(err);
        console.error(err);
      }
    };

    fetchDataAsync();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isLoaded) return <h1>Loading...</h1>

  return (
    <div className={styles.container}>
      <Head>
        <title>Evolve Client</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Get ready to evolve. <br/>Test your new API!
        </h1>
        {evolvePosts.length > 0 ? (
          <>
            <h2>
              {`You have ${evolvePosts.length} ${evolvePosts.length === 1 ? 'post' : 'posts'} from your Evolve custom post type:`}
            </h2>
            <ul>
              {
                evolvePosts.map((post) => (
                  <li key={post.id}>
                    <h3>
                      {post.title.rendered}
                    </h3>
                  </li>
                ))
              }
            </ul>   
          </>
        ) : (
          <p>
            Go add a new Evolve post in the CMS and refresh this page to see it appear here!
          </p>
        )}
      </main>
    </div>
  )
}

export default Index;

const getPosts = async (apiURL, endpoint) => {
  const res = await fetch(`${apiURL}/wp-json/wp/v2/${endpoint}`);
  const result = await res.json();
  return result;
};