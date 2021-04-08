import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { Document } from '@prismicio/client/types/documents';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const postFormatter = (results: Document[]): Post[] => {
  return results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));
};

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;

  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);

  const handleLoadPosts = (): void => {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        const newPosts = postFormatter(data.results);

        setPosts([...posts, ...newPosts]);
        setNextPage(data.next_page);
      });
  };

  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        <main>
          {posts.map(post => (
            <article key={post.uid} className={styles.post}>
              <Link href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
              </Link>
              <p>{post.data.subtitle}</p>

              <ul className={commonStyles.postInformations}>
                <li>
                  <FiCalendar />
                  <time>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                </li>
                <li>
                  <FiUser />
                  <span>{post.data.author}</span>
                </li>
              </ul>
            </article>
          ))}
        </main>

        {nextPage && (
          <button
            type="button"
            onClick={handleLoadPosts}
            className={styles.morePostsButton}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const posts = postFormatter(response.results);

  return {
    props: {
      postsPagination: { results: posts, next_page: response.next_page },
    },
  };
};
