import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const [readingTime, _] = useState(() => {
    const totalWords = post.data.content.reduce((acc, content) => {
      const text = RichText.asText(content.body);

      return acc + text.split(' ').length;
    }, 0);

    return Math.ceil(totalWords / 200);
  });

  if (router.isFallback) {
    return (
      <div>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <>
      <Header />

      <img
        src={post.data.banner.url}
        alt={post.data.title}
        className={styles.banner}
      />

      <div className={commonStyles.container}>
        <div className={styles.postInformationsContainer}>
          <h1>{post.data.title}</h1>

          <ul className={commonStyles.postInformations}>
            <li>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
            </li>
            <li>
              <FiUser />
              <span>{post.data.author}</span>
            </li>
            <li>
              <FiClock />
              <span>{`${readingTime} min`}</span>
            </li>
          </ul>
        </div>

        <article className={styles.postContent}>
          {post.data.content.map(({ heading, body }) => (
            <Fragment key={heading}>
              <h2>{heading}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(body),
                }}
              />
            </Fragment>
          ))}
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [],
    }
  );

  const paths = response.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(params.slug), {});

  return {
    props: {
      post: {
        uid: response.uid,
        first_publication_date: response.first_publication_date,
        data: {
          title: response.data.title,
          subtitle: response.data.subtitle,
          banner: response.data.banner,
          author: response.data.author,
          content: response.data.content,
        },
      },
    },
  };
};
