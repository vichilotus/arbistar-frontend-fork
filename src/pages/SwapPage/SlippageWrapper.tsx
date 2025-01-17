import useParsedQueryString from 'hooks/useParsedQueryString';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserSlippageTolerance } from 'state/user/hooks';

export const SlippageWrapper: React.FC = () => {
  const { t } = useTranslation();
  const parsedQs = useParsedQueryString();
  const swapSlippage = parsedQs.slippage
    ? (parsedQs.slippage as string)
    : undefined;
  const [
    allowedSlippage,
    setUserSlippageTolerance,
  ] = useUserSlippageTolerance();

  useEffect(() => {
    if (swapSlippage) {
      setUserSlippageTolerance(Number(swapSlippage));
    }
  }, [swapSlippage]);

  return (
    <small className='text-secondary'>
      {allowedSlippage / 100}% {t('slippage')}
    </small>
  );
};
