import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home(): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <main>
        <article className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida</p>

          <ul>
            <li>
              <FiCalendar />
              <time>19 Abr 2021</time>
            </li>
            <li>
              <FiUser />
              <span>Joseph Oliveira</span>
            </li>
          </ul>
        </article>
        <article className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <p>Pensando em sincronização em vez de ciclos de vida</p>

          <ul>
            <li>
              <FiCalendar />
              <time>19 Abr 2021</time>
            </li>
            <li>
              <FiUser />
              <span>Joseph Oliveira</span>
            </li>
          </ul>
        </article>
      </main>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
