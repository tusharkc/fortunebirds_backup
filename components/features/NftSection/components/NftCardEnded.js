import Image from "next/image";
import React from "react";

const NftCardEnded = ({ nftSrc, campaignId, winner, assetId }) => {
  return (
    <>
      <div className="rounded nft_card_container">
        <div className="w-full  relative z-10">
          <div className="ended_tag w-20 bg-zinc-700 flex items-center justify-around rounded absolute right-2 top-2 p-1">
            <img width={18} src="/media/icons/feather-pointed-solid.svg" />
            <p className="text-white font-bold">Ended</p>
          </div>
        </div>
        <a
          href={`https://wax.atomichub.io/explorer/asset/${assetId}`}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="ended_overly"
            height={100}
            width={"100%"}
            loading="lazy"
            src={nftSrc}
            objectFit={"fill"}
            layout={"responsive"}
          />
        </a>
        <div className="nft_card_content_container text-center">
          <h2 className="nft_card_campaign_id">Campaign Id: {campaignId}</h2>

          <div className="bg-green-900 uppercase text-white mx-6 rounded px-2 py-2 winner_indecator">
            Winner : {winner}
          </div>

          <p className="font-semibold py-2.5 thanks_for_joining_text">
            Thanks For Joining
          </p>
        </div>
      </div>
    </>
  );
};

export default NftCardEnded;
