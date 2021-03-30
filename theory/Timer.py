class Timer:
    """클래스 생성 시점부터 소멸 시점까지의 시간을 출력한다."""

    def __init__(self, func_name: str='this func'):
        self.func_name: str = func_name
        self.time_start: float = 0.0

    def __enter__(self):
        import sys
        import time
        print('======================== {} ==========================\n'.format(self.func_name), end=' ')
        sys.stdout.flush()
        self.time_start = time.process_time()
        return self

    def __exit__(self, *args):
        import time
        time_end = time.process_time()
        interval = time_end - self.time_start
        print('================================================================\n')
        print('Elapsed time : {:.8f} sec '.format(interval))