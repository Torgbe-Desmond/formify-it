import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed versions of useDispatch and useSelector.
 * Use these throughout the app instead of the plain react-redux versions.
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
