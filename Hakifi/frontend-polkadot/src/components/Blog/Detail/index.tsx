"use client";

import GHOST_DETAIL from '@/@type/blog.type';
import TwitterIcon from '@/components/common/Icons/TwitterIcon';
import { Separator } from '@/components/common/Separator';
import Spinner from '@/components/common/Spinner';
import { formatTime } from '@/utils/format';
import { usePathname } from 'next/navigation';
import Related from './Related';
type BlogDetailProps = {
  post?: GHOST_DETAIL;
  relatedPosts?: GHOST_DETAIL[];
};

import FacebookIcon from '@/components/common/Icons/FacebookIcon';
import LinkedinIcon from '@/components/common/Icons/LinkedinIcon';
import RedditIcon from '@/components/common/Icons/RedditIcon';
import '@/styles/blog.scss';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton
} from 'next-share';
import BackToPrevious from './BackToPrevious';

const BlogDetail = ({ post, relatedPosts }: BlogDetailProps) => {

  const pathname = usePathname();

  if (!post) {
    return <section className="flex flex-col items-center justify-center min-h-[236px] gap-2">
      <Spinner size="small" />
    </section>;
  }

  const shareUrl = process.env.NEXT_PUBLIC_API_BASE_URL + pathname;
  return (
    <>
      <section className="mx-4 lg:w-[1210px] lg:mx-auto lg:mt-15 mt-10 h-10 flex items-center">
        <BackToPrevious />
      </section>
      <section className="flex items-start justify-center lg:mt-5 mt-4 lg:flex-row flex-col">

        <section id="ghost_global" className="mb-15">
          <section className="lg:min-w-[832px] lg:max-w-[832px] mx-4 lg:mr-[43px] lg:ml-0">
            <p className="text-title-20 lg:text-title-24 text-typo-primary text-left">{post?.title}</p>

            <section className="flex items-center gap-2 lg:gap-3 my-4 lg:my-5">
              <p className="text-body-14 text-typo-secondary">{formatTime(post?.created_at || new Date(), "yyyy-MM-dd")}</p>
              <section className="flex items-center gap-2 lg:gap-3">
                {
                  post?.tags.map(item => {
                    return <section key={item.id} className="text-body-12 lg:text-body-14 py-1 px-2 bg-background-primary rounded-sm">{item.name}</section>;
                  })
                }
              </section>
            </section>
            <div className="ghost_content gh-canvas ghost_cards">

              <div className="mt-4 lg:mt-5 text-typo-secondary gh-content" dangerouslySetInnerHTML={{ __html: post?.html }} />
            </div>

            <Separator className="my-4 lg:my-5" />

            <section className="flex lg:justify-normal items-center gap-3">
              <div className="text-body-14 text-typo-primary">Share post</div>
              <section className="flex items-center gap-3 text-support-black">
                <TwitterShareButton url={shareUrl} key="tw">
                  <TwitterIcon className="size-7" fill="#F37B23" />
                </TwitterShareButton>
                <FacebookShareButton url={shareUrl} key="fa">
                  <FacebookIcon className="size-7" fill="#F37B23" />
                </FacebookShareButton>
                {/* <TelegramShareButton url={shareUrl} key="tl">
                  <TelegramIcon className="size-7" fill="#F37B23" />
                </TelegramShareButton> */}

                <LinkedinShareButton url={shareUrl} key="link">
                  <LinkedinIcon className="size-7" fill="#F37B23" />
                </LinkedinShareButton>

                <RedditShareButton url={shareUrl} key="rd">
                  <RedditIcon className="size-7" fill="#F37B23" />
                </RedditShareButton>
              </section>
            </section>

          </section>
        </section>

        <section className="px-4 lg:px-0 mb-15 lg:mb-0 lg:max-w-[335px] w-full">
          <section className="lg:text-heading-3 text-heading-4 text-typo-primary uppercase leading-[28px]">Related post</section>

          <section className="mt-6">
            <Related related={relatedPosts || []} />
          </section>
        </section>
      </section>
    </>
  );
};

export default BlogDetail;