import React from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@material-ui/core';
import { DoubleCurrencyLogo } from 'components';
import { formatNumber } from 'utils';
import APRHover from 'assets/images/aprHover.png';
import { useTranslation } from 'react-i18next';
import { V3FarmAPRTooltip } from './V3FarmAPRTooltip';
import { useHistory } from 'react-router-dom';
import useParsedQueryString from 'hooks/useParsedQueryString';
import { useActiveWeb3React } from 'hooks';
import { V3FarmPair } from './AllV3Farms';

interface Props {
  farm: V3FarmPair;
}

export const V3FarmCard: React.FC<Props> = ({ farm }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { chainId } = useActiveWeb3React();
  const parsedQuery = useParsedQueryString();
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  // const rewards = (farm.distributionData ?? [])
  //   .filter((item: any) => item.isLive)
  //   .map((item: any) => {
  //     const rewardDuration =
  //       (item?.endTimestamp ?? 0) - (item?.startTimestamp ?? 0);
  //     const dailyAmount =
  //       rewardDuration > 0
  //         ? ((item?.amount ?? 0) / rewardDuration) * 3600 * 24
  //         : 0;
  //     return { ...item, dailyAmount };
  //   })
  //   .reduce((memo: any[], item: any) => {
  //     const existingItemIndex = memo.findIndex(
  //       (rewardItem) =>
  //         rewardItem.rewardToken.toLowerCase() ===
  //         item.rewardToken.toLowerCase(),
  //     );
  //     if (existingItemIndex > -1) {
  //       const existingItem = memo[existingItemIndex];
  //       memo = [
  //         ...memo.slice(0, existingItemIndex - 1),
  //         {
  //           ...existingItem,
  //           dailyAmount:
  //             (existingItem?.dailyAmount ?? 0) + (item?.dailyAmount ?? 0),
  //         },
  //         ...memo.slice(0, existingItemIndex),
  //       ];
  //     } else {
  //       memo.push(item);
  //     }
  //     return memo;
  //   }, []);

  const redirectWithCurrencies = (farm: V3FarmPair) => {
    const currentPath = history.location.pathname + history.location.search;
    let redirectPath;
    if (parsedQuery && parsedQuery.token0) {
      if (parsedQuery.token1) {
        redirectPath = currentPath
          .replace(
            `token0=${parsedQuery.token0}`,
            `token0=${farm.token0.address}`,
          )
          .replace(
            `token1=${parsedQuery.token1}`,
            `token1=${farm.token1.address}`,
          );
      } else {
        redirectPath = `${currentPath.replace(
          `token0=${parsedQuery.token0}`,
          `token0=${farm.token0.address}`,
        )}&token1=${farm.token1.address}`;
      }
    } else {
      if (parsedQuery && parsedQuery.token1) {
        redirectPath = `${currentPath.replace(
          `token1=${parsedQuery.token1}`,
          `token1=${farm.token1.address}`,
        )}&token0=${farm.token0.address}`;
      } else {
        redirectPath = `${currentPath}${
          history.location.search === '' ? '?' : '&'
        }token0=${farm.token0.address}&token1=${farm.token1.address}`;
      }
    }
    history.push(redirectPath);
  };

  return (
    <Box width='100%' borderRadius={16} className='bg-secondary1'>
      <Box padding={2} className='flex items-center flex-wrap'>
        <Box
          width={isMobile ? '100%' : '90%'}
          className='flex items-center flex-wrap'
        >
          <Box
            width={isMobile ? '80%' : '30%'}
            className='flex items-center'
            gridGap={12}
          >
            <DoubleCurrencyLogo
              currency0={farm.token0}
              currency1={farm.token1}
              size={24}
            />
            <p>
              {farm.token0?.symbol}/{farm.token1?.symbol}
            </p>
          </Box>
          <Box
            my={2}
            width={isMobile ? '100%' : '20%'}
            className='flex items-center justify-between'
          >
            {isMobile && <p>{t('tvl')}</p>}
            <p>${formatNumber(farm.tvl)}</p>
          </Box>
          <Box
            width={isMobile ? '100%' : '20%'}
            className='flex items-center justify-between'
          >
            {isMobile && <p>{t('apr')}</p>}
            <Box>
              <small>{t('upTo')}</small>
              <Box className='flex'>
                <V3FarmAPRTooltip farm={farm}>
                  <Box className='farmCardAPR' gridGap={4}>
                    <p>{formatNumber(farm.apr)}%</p>
                    <img src={APRHover} width={16} />
                  </Box>
                </V3FarmAPRTooltip>
              </Box>
            </Box>
          </Box>
          {/* <Box
            width={isMobile ? '100%' : '30%'}
            my={rewards.length > 0 ? 2 : 0}
            className='flex items-center justify-between'
          >
            {isMobile && rewards.length > 0 && <p>{t('rewards')}</p>}
            {rewards.map((reward: any) => (
              <p key={reward.rewardToken}>
                {formatNumber(reward.dailyAmount)} {reward.symbolRewardToken}{' '}
                <small className='text-secondary'>{t('daily')}</small>
              </p>
            ))}
          </Box> */}
        </Box>
        <Box width={isMobile ? '100%' : '10%'}>
          <Button
            className='farmCardButton'
            disabled={!farm?.token0?.address || !farm?.token1?.address}
            onClick={() => {
              redirectWithCurrencies(farm);
            }}
          >
            {t('view')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default V3FarmCard;
