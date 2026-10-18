import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FoodIndex } from '../domain/foodIndex';
import { FoodInput } from './FoodInput';

const index = new FoodIndex();

function setup() {
  const onAdd = vi.fn();
  render(<FoodInput index={index} usage={new Map()} onAdd={onAdd} />);
  return { onAdd, input: screen.getByRole('combobox', { name: 'O que você comeu?' }) };
}

describe('FoodInput', () => {
  it('separa uma frase inteira em itens ao apertar Enter', async () => {
    const { onAdd, input } = setup();
    await userEvent.type(input, 'tomei café e comi 2 torradas{Enter}');
    expect(onAdd).toHaveBeenCalledWith([
      { name: 'Café', foodId: 'cafe' },
      { name: 'Torrada', foodId: 'torrada', quantity: '2' },
    ]);
    expect(input).toHaveValue('');
  });

  it('sugere alimentos enquanto digita e mantém a quantidade', async () => {
    const { onAdd, input } = setup();
    await userEvent.type(input, 'arroz, 2 fatias de pão inte');
    await userEvent.click(await screen.findByRole('option', { name: /Pão integral/ }));
    expect(onAdd).toHaveBeenCalledWith([
      { name: 'Arroz', foodId: 'arroz' },
      { name: 'Pão integral', foodId: 'pao_integral', quantity: '2 fatias' },
    ]);
  });

  it('avisa quando não encontra alimentos', async () => {
    const { onAdd, input } = setup();
    await userEvent.type(input, 'almoço{Enter}');
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Não encontrei nenhum alimento');
  });
});
