import { QueryCollection, QueryExpression, count } from '../src';
// eslint-disable-next-line no-unused-vars
import { min, max, mean, sum } from 'mathjs';
import { MemoryAdapter } from './TestMemoryAdapter';
import { initDatabase } from './TestMemoryDatabase';

describe('Aggregate Functions', () => {
    beforeAll(async () => {
        await initDatabase();
    });
    it('should use min()', async () => {
        let a = new QueryExpression().select( x => {
            return {
                SmallestPrice: min(x.Price)
            }
        })
        .from('Products');
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].SmallestPrice).toBe(2.5);
    });
    it('should use max()', async () => {
        let a = new QueryExpression().select( x => {
            return {
                LargestPrice: max(x.Price)
            }
        })
        .from('Products');
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].LargestPrice).toBe(263.5);
    });
    it('should use avg()', async () => {
        let a = new QueryExpression().select( x => {
            return {
                AveragePrice: mean(x.Price)
            }
        })
        .from('Products');
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].AveragePrice).toBeGreaterThanOrEqual(28.866);
    });

    it('should use sum()', async () => {
        const OrderDetails = new QueryCollection('Order_Details');
        let a = new QueryExpression().select( x => {
            return {
                TotalQuantity: sum(x.Quantity)
            }
        })
        .from(OrderDetails);
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].TotalQuantity).toBeTruthy();
    });
    it('should use count()', async () => {
        let a = new QueryExpression().select( x => {
            return {
                TotalProducts: count(x.ProductID)
            }
        })
        .from('Products');
        let result = await new MemoryAdapter().executeAsync(a);
        expect(result.length).toBeTruthy();
        expect(result[0].TotalProducts).toBeTruthy();
    });
    
});