import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { client } from "../components/sanity";
import "fastpix-player";
import { SanityDocument } from "@sanity/client";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const POSTS_QUERY = `*[
  _type == "videoPost"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, name, videourl, slug, image, publishedAt}`;

const CONTENT_POSTS_QUERY = `*[
  _type == "createContent"
]|order(publishedAt desc)[0...12]{_id, name, videoObject, publishedAt}`;

export const loader = async () => {
  const posts = await client.fetch<SanityDocument[]>(CONTENT_POSTS_QUERY);
  console.log("Posts - ", posts);

  return {
    posts: await client.fetch<SanityDocument[]>(CONTENT_POSTS_QUERY)
  };
}

const Accordion = ({ data }) => {
  const dateFormat = (dateFormat) => {
    const gotDate = new Date(dateFormat)
    const dtFrmt = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'long',
      timeStyle: 'long',
      timeZone: 'Australia/Sydney',
    }).format(gotDate);

    return dtFrmt;
  }

  return (
    <div className="w-full border border-gray-200 rounded mb-2">
      <div className="mt-3 bg-gray-200 p-4 min-h-[300px]">
        <fp-player
          stream-type="on-demand"
          // playback-id={data?.videoUrl.playbackIds[0].id}
          playback-id={data?.videoObject?.playbackId}
          playback-url="https://stream.fastpix.io"
          primary-color="#F5F5F5"
          thumbnail-url="https://images.fastpix.io"
        />
      </div>
      <div className="flex justify-between gap-x-6 py-5 px-2">
        <div className="flex min-w-0 gap-x-4">
          <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={`https://images.fastpix.io/${data?.videoObject?.playbackId}/thumbnail.jpg`} alt="" />
          <div className="min-w-0 flex-auto">
            <p className="text-sm/6 font-semibold text-gray-900">
              {data?.name || ""}
            </p>
            <p className="mt-1 truncate text-xs/5 text-gray-500">
              {
                dateFormat(data?.publishedAt)
              }
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{
            data?.videoObject?.status
          }</span>
        </div>
      </div>

    </div>
  )
}

export default function Index() {

  const loaderData = useLoaderData();

  console.log('LoaderData - ', loaderData);

  return (
    <div className="w-ful;">
      <div className="w-full max-w-[700px] mx-auto">
        <ul role="list" className="divide-y divide-gray-100">
          {
            loaderData?.posts && loaderData.posts.length > 0 && loaderData.posts.map((itm) => (
              <li className="flex justify-between gap-x-6 py-5" key={itm._id}>
                <Accordion data={itm} />
              </li>
            ))
          }

        </ul>
      </div>
    </div>
  );
}
