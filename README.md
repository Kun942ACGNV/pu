import sys

def main():
    data = sys.stdin.read().strip().split()
    if not data:
        return
    it = iter(data)
    M = int(next(it))
    N = int(next(it))

    price_map = {}
    for _ in range(M):
        name = next(it)
        price = next(it)
        price_map[name] = price

    out_lines = []
    for _ in range(N):
        q = next(it)
        out_lines.append(price_map[q])

    sys.stdout.write("\n".join(out_lines))

if __name__ == "__main__":
    main()
