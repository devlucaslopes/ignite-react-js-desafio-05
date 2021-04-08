import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
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
  return (
    <>
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
              <time>{post.first_publication_date}</time>
            </li>
            <li>
              <FiUser />
              <span>{post.data.author}</span>
            </li>
            <li>
              <FiClock />
              <span>4 min</span>
            </li>
          </ul>
          <span className={styles.editedAt}>
            * editado em 19 mar 2021, às 15:49
          </span>
        </div>

        <article className={styles.postContent}>
          {post.data.content.map(({ heading, body }) => (
            <>
              <h2>{heading}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: body.map(item => item).join(''),
                }}
              />
            </>
          ))}
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(params.slug), {});

  return {
    props: {
      post: {
        first_publication_date: new Date(
          response.first_publication_date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        data: {
          title: response.data.title,
          banner: response.data.banner,
          author: response.data.author,
          content: response.data.content.map(({ heading, body }) => ({
            heading,
            body: body.map(item => RichText.asHtml([item])),
          })),
        },
      },
    },
  };
};
