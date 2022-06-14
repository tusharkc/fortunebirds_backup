import axios from "axios";
import Head from "next/head";
import React from "react";
import { useContext } from "react";
import { useEffect, useState } from "react";
import {
  ATOMIC_ASSETS_END_POINT,
  IPFS_URL,
  WAX_PINK_END_POINT,
} from "../components/constants/constants";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCardEnded from "../components/features/NftSection/components/NftCardEnded";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";
const nftCardDataArray = [];

const Ended = (props) => {
  const { isLoadingData, nftDataLoading } = useContext(NftContext);

  const { nftCardDataObj } = props;

  const [nftCardData, setNftCardData] = useState();

  useEffect(() => {
    setNftCardData(nftCardDataObj);
  }, [nftCardDataObj]);

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <Head>
            <title>Feathers Of Fortune</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
              rel="stylesheet"
            />
          </Head>
          <AppLayout>
            <div className="container my-20 mx-auto">
              <NftFilter />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {nftDataLoading ? (
                  <div className="flex items-center justify-center w-screen">
                    <div className="nft_data_loader" />
                  </div>
                ) : nftCardData !== undefined ? (
                  nftCardData.map((item, index) => {
                    return (
                      <>
                        {item.nftImgUrl.search("undefined") > -1 == false && (
                          <div className="grid-cols-4">
                            <NftCardEnded
                              nftSrc={item.nftImgUrl}
                              winner={item.winner}
                              campaignId={item.campaignId}
                              assetId={item.assetId}
                            />
                          </div>
                        )}
                      </>
                    );
                  })
                ) : (
                  ""
                )}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default Ended;
export async function getStaticProps() {
  const responseFromPost = await axios.post(
    `${WAX_PINK_END_POINT}/v1/chain/get_table_rows`,
    {
      json: true,
      code: "fortunebirds",
      scope: "fortunebirds",
      table: "results",
      limit: 14,
    }
  );

  for (let i = 0; i < responseFromPost.data.rows?.length; i++) {
    const endedCampaign = responseFromPost.data.rows[i];

    if (endedCampaign?.asset_id?.length > 0) {
      const response = await axios.get(
        `${ATOMIC_ASSETS_END_POINT}/atomicassets/v1/assets/${endedCampaign?.asset_id}`
      );

      const nftCardDataObjEnded = {
        assetId: response.data?.data?.asset_id,
        nftImgUrl: `${IPFS_URL}/${response?.data?.data?.data?.img}`,
        campaignId: endedCampaign?.campaign_id,
        winner: endedCampaign?.winner,
      };

      nftCardDataArray.push(nftCardDataObjEnded);
    }
  }

  return {
    props: {
      nftCardDataObj: nftCardDataArray,
    },
    revalidate: 10,
  };
}
