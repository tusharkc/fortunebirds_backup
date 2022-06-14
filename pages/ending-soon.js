import axios from "axios";
import React from "react";
import { useContext } from "react";
import {
  ATOMIC_ASSETS_END_POINT,
  IPFS_URL,
  WAX_PINK_END_POINT,
} from "../components/constants/constants";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/components/NftCard";
import AppLayout from "../components/layout/AppLayout";
import { StartFirebase } from "../context/firebase-config";
import { NftContext } from "../context/NftContext";
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { startFirebaseAdmin } from "../context/firebase-admin";

const EndingSoon = () => {
  const firebaseDb = StartFirebase();
  const { isLoadingData } = useContext(NftContext);
  const nowUTCEpochTimeInMilliSec = new Date(Date.now()).getTime();
  const [nftCardData, setNftCardData] = useState([]);

  useEffect(() => {
    const singularCampaignArr = [];
    onValue(ref(firebaseDb), (snapshot) => {
      if (snapshot.exists()) {
        snapshot.child("campaigns").forEach((singularCampaign) => {
          const singularCampaignObj = singularCampaign
            .child("runningCampaign")
            .val();

          if (
            Date.parse(`${singularCampaignObj.lastRoll}Z`) +
              singularCampaignObj.loopTimeSeconds * 1000 -
              nowUTCEpochTimeInMilliSec >
              0 &&
            singularCampaignObj.totalEntriesStart !=
              singularCampaignObj.totalEntriesEnd
          ) {
            singularCampaignArr.push(singularCampaignObj);
          }
        });
      }
    });

    singularCampaignArr.sort((a, b) => {
      return (
        Date.parse(`${a.lastRoll}Z`) +
        a.loopTimeSeconds * 1000 -
        nowUTCEpochTimeInMilliSec -
        (Date.parse(`${b.lastRoll}Z`) +
          b.loopTimeSeconds * 1000 -
          nowUTCEpochTimeInMilliSec)
      );
    });

    setNftCardData(singularCampaignArr);
  }, [nftCardData]);

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <AppLayout>
            <div className="container my-20 mx-auto">
              <NftFilter />
              <div className="grid grid-col-1 md:grid-cols-4 gap-8">
                {nftCardData.length > 0
                  ? nftCardData.map((item, index) => {
                      return (
                        <div key={index} className="grid-cols-4">
                          <NftCard
                            nftSrc={item.nftImgUrl}
                            campaignId={item.campaignId}
                            creator={item.creator}
                            loopTimeSeconds={item.loopTimeSeconds}
                            totalEntriesStart={item.totalEntriesStart}
                            totalEntriesEnd={item.totalEntriesEnd}
                            entryCost={item.entryCost}
                            contractAccount={item.contractAccount}
                            lastRoll={item.lastRoll}
                            isVideo={item.isVideo}
                            videoNftUrl={item.videoNftUrl}
                            assetId={item.assetId}
                            joinedAccounts={item.joinedAccounts}
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default EndingSoon;

export async function getStaticProps() {
  const firebaseDb = StartFirebase();
  const adminDb = startFirebaseAdmin();

  const responseFromPost = await axios.post(
    `${WAX_PINK_END_POINT}/v1/chain/get_table_rows`,
    {
      json: true,
      code: "fortunebirds",
      scope: "fortunebirds",
      table: "campaigns",
      limit: 150,
    }
  );

  onValue(ref(adminDb), async (snapshot) => {
    try {
      for (let i = 0; i < responseFromPost?.data?.rows?.length; i++) {
        const runningCampaigns = responseFromPost.data?.rows[i];
        if (
          runningCampaigns?.asset_ids?.length > 0 &&
          snapshot
            .child("campaigns")
            .hasChild(runningCampaigns?.asset_ids[0]) == false
        ) {
          const response = await axios.get(
            `${ATOMIC_ASSETS_END_POINT}/atomicassets/v1/assets/${runningCampaigns?.asset_ids[0]}`
          );

          const runningCampaign = {
            joinedAccounts: runningCampaigns?.accounts || [],
            assetId: response.data?.data?.asset_id,
            contractAccount: runningCampaigns?.contract_account,
            nftImgUrl: `${IPFS_URL}/${response?.data?.data?.data?.img}`,
            videoNftUrl: `${IPFS_URL}/${response?.data?.data?.template?.immutable_data?.video}`,
            isVideo:
              `${IPFS_URL}/${response?.data?.data?.data?.img}` == true
                ? false
                : `${IPFS_URL}/${response?.data?.data?.data?.video}` !=
                  `${IPFS_URL}/undefined`
                ? true
                : false,
            campaignId: runningCampaigns?.id,
            creator: runningCampaigns?.authorized_account,
            entryCost: runningCampaigns?.entrycost,
            totalEntriesStart: runningCampaigns?.accounts?.length || 0,
            totalEntriesEnd: runningCampaigns?.max_users,
            loopTimeSeconds: runningCampaigns?.loop_time_seconds,
            lastRoll: runningCampaigns?.last_roll,
            totalEntriesEnd: runningCampaigns?.max_users,
          };

          set(ref(adminDb, `/campaigns/${runningCampaigns?.asset_ids[0]}`), {
            runningCampaign,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  return {
    props: {},
    revalidate: 10,
  };
}
